"use strict";

/**
 * Module dependencies.
 */
var mongoose = require("mongoose"),
  passport = require("passport"),
  User = mongoose.model("User"),
  mailer = require("../../app/util/mailer"),
  _ = require("lodash"),
  winston = require("winston"),
  LocalStrategy = require("passport-local").Strategy,
  bcrypt = require("bcrypt-nodejs"),
  BPromise = require("bluebird"),
  async = require("async"),
  crypto = require("crypto");

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
  var message = "";

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = "Email already exists";
        break;
      default:
        message = "Something went wrong";
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  return message;
};

/**
 * Get the user by id
 */
exports.read = function(req, res) {
  var user = req.user;

  delete user.salt;
  delete user.password;
  delete user.email;

  res.jsonp(req.user);
};

/**
 * Signup
 */
exports.signup = function(req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);
  var message = null;

  // Add missing user fields
  user.provider = "local";
  user.displayName = user.firstName + " " + user.lastName;
  user.email = user.email.toLowerCase();

  // Then save the user
  user.save(function(err) {
    if (err) {
      winston.error("Error signing up user", err);
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      mailer.send("welcome.email.html", { user: user }, user.email, "Welkom!");

      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function(err) {
        if (err) {
          winston.error("Error logging in user", user._id);
          res.send(400, err);
        } else {
          res.jsonp(user);
        }
      });
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    if (err || !user) {
      res.send(400, info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
      req.login(user, function(err) {
        if (err) {
          winston.error("Error logging in user", user._id);
          res.send(400, err);
        } else {
          res.jsonp(user);
        }
      });
    }
  })(req, res, next);
};

/**
 * Update user details
 */
exports.update = function(req, res) {
  // Init Variables
  var user = req.user;
  var message = null;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (user) {
    // Merge existing user
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.displayName = user.firstName + " " + user.lastName;

    user.save(function(err) {
      if (err) {
        winston.error("Error updating user", user._id);
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        req.login(user, function(err) {
          if (err) {
            winston.error("Error logging in user", user._id);
            res.send(400, err);
          } else {
            res.jsonp(user);
          }
        });
      }
    });
  } else {
    res.send(400, {
      message: "User is not signed in"
    });
  }
};

/**
 * Remove user
 */
exports.delete = function(req, res) {
  var user = req.user;

  user.remove(function(err) {
    if (err) {
      winston.error("Error deleting user", user._id);
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.send(200);
    }
  });
};

/**
 * Change Password
 */
exports.changePassword = function(req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;

  if (req.user) {
    User.findById(req.user.id, function(err, user) {
      if (!err && user) {
        if (user.authenticate(passwordDetails.currentPassword)) {
          if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
            user.password = passwordDetails.newPassword;

            user.save(function(err) {
              if (err) {
                winston.error("Error changing user password", user._id);
                return res.send(400, {
                  message: getErrorMessage(err)
                });
              } else {
                req.login(user, function(err) {
                  if (err) {
                    winston.error("Error logging in user", user._id);
                    res.send(400, err);
                  } else {
                    res.send({
                      message: "Password changed successfully"
                    });
                  }
                });
              }
            });
          } else {
            res.send(400, {
              message: "Passwords do not match"
            });
          }
        } else {
          res.send(400, {
            message: "Current password is incorrect"
          });
        }
      } else {
        res.send(400, {
          message: "User is not found"
        });
      }
    });
  } else {
    res.send(400, {
      message: "User is not signed in"
    });
  }
};

/**
 * Signout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect("/");
};

/**
 * Send User
 */
exports.me = function(req, res) {
  res.jsonp(req.user || null);
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
  return function(req, res, next) {
    passport.authenticate(strategy, function(err, user, redirectURL) {
      if (err || !user) {
        return res.redirect("/signin");
      }
      req.login(user, function(err) {
        if (err) {
          winston.error("Error logging in user", user._id);
          return res.redirect("/signin");
        }
        return res.redirect(redirectURL || "back");
      });
    })(req, res, next);
  };
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
  User.findOne({
    _id: id
  }).exec(function(err, user) {
    if (err) {
      winston.error("Error finding user by id", id);
      return next(err);
    }
    if (!user) return next(new Error("Failed to load User " + id));
    req.profile = user;
    next();
  });
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send(401, {
      message: "User is not logged in"
    });
  }

  next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
  var _this = this;

  return function(req, res, next) {
    _this.requiresLogin(req, res, function() {
      if (_.intersection(req.user.roles, roles).length) {
        return next();
      } else {
        return res.send(403, {
          message: "User is not authorized"
        });
      }
    });
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField =
      "providerData." + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField =
      "additionalProvidersData." +
      providerUserProfile.provider +
      "." +
      providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] =
      providerUserProfile.providerData[
        providerUserProfile.providerIdentifierField
      ];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] =
      providerUserProfile.providerData[
        providerUserProfile.providerIdentifierField
      ];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function(err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername =
            providerUserProfile.username ||
            (providerUserProfile.email
              ? providerUserProfile.email.split("@")[0]
              : "");

          User.findUniqueUsername(possibleUsername, null, function(
            availableUsername
          ) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function(err) {
              mailer.send(
                "welcome.email.html",
                { user: user },
                user.email,
                "Welkom!"
              );

              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    User.findById(req.user.id, function(err, user) {
      if (err) {
        return done(err);
      } else {
        // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
        if (
          user &&
          user.provider !== providerUserProfile.provider &&
          (!user.additionalProvidersData ||
            !user.additionalProvidersData[providerUserProfile.provider])
        ) {
          // Add the provider data to the additional provider data field
          if (!user.additionalProvidersData) user.additionalProvidersData = {};
          user.additionalProvidersData[providerUserProfile.provider] =
            providerUserProfile.providerData;

          // Then tell mongoose that we've updated the additionalProvidersData field
          user.markModified("additionalProvidersData");

          // And save the user
          user.save(function(err) {
            return done(err, user, "/");
          });
        } else {
          return done(err, user);
        }
      }
    });
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
  var user = req.user;
  var provider = req.param("provider");

  if (user && provider) {
    // Delete the additional provider
    if (user.additionalProvidersData[provider]) {
      delete user.additionalProvidersData[provider];

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified("additionalProvidersData");
    }

    user.save(function(err) {
      if (err) {
        return res.send(400, {
          message: getErrorMessage(err)
        });
      } else {
        req.login(user, function(err) {
          if (err) {
            res.send(400, err);
          } else {
            res.jsonp(user);
          }
        });
      }
    });
  }
};

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
  if (!req.body.email) {
    return res.send(400, {
      message: "Email field must not be blank"
    });
  }

  new BPromise(function(resolve, reject) {
    crypto.randomBytes(20, function(err, buf) {
      if (err) reject(err);

      var token = buf.toString("hex");
      resolve(token);
    });
  })
    .then(function(token) {
      var defer = BPromise.defer();

      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return defer.reject(
            res.send(400, {
              message: "No account with that email address exists"
            })
          );
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 86400000; // 1 day

        user.save(function(err) {
          defer.resolve([token, user]);
        });
      });

      return defer.promise;
    })
    .spread(function(token, user) {
      var context = {
        user: user,
        resetLink: "http://" + req.headers.host + "/auth/reset/" + token
      };
      mailer.send(
        "resetpassword.email.html",
        context,
        user.email,
        "Wachtwoord herstellen"
      );

      res.send(200);
    })
    .catch(function(err) {
      next(err);
    });
};

/**
 * Reset password GET from email token
 */
exports.resetGet = function(req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    function(err, user) {
      if (!user) {
        res.send(400, {
          message: "Password reset token is invalid or has expired."
        });
        return res.redirect("/forgot");
      }

      res.redirect("/reset/" + req.params.token);
    }
  );
};

/**
 * Reset password POST from email token
 */
exports.resetPost = function(req, res) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;

  BPromise.resolve(
    User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    }).exec()
  )
    .then(function(user) {
      var defer = BPromise.defer();

      if (user) {
        if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
          user.password = passwordDetails.newPassword;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            if (err) defer.reject(err);

            req.login(user, function(err) {
              if (err) {
                defer.reject(err);
              } else {
                defer.resolve(user);
              }
            });
          });
        } else {
          defer.reject("Passwords do not match");
        }
      } else {
        defer.reject("Password reset token is invalid or has expired.");
      }
    })
    .then(function() {
      // send an email maybe?
      res.send(200);
    })
    .catch(function(message) {
      res.send(400, {
        message: message
      });
    });
};

/**
 * User authorizations routing middleware
 */
exports.hasAnalytics = function(req, res, next) {
  if (
    req.user.subscription.plan === "PRO" ||
    req.user.subscription.plan === "BUSINESS"
  ) {
    next();
  } else {
    return res.send(400, {
      message: "User is not authorized."
    });
  }
};
