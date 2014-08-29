'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  config = require('../../config/config'),
  stripe = require('stripe')(config.stripe.secretkey),
  async = require('async'),
  _ = require('lodash');


function createCustomer(user, plan, card, couponCode, done) {
  var options = {
    email: user.email,
    plan: plan
  };

  if (card) options.card = card;
  if (couponCode) options.coupon = couponCode;

  stripe.customers.create(options,
    function(err, customer) {
      if (err) return done(err);

      user.customerToken = customer.id;
      user.subscriptionPlan = plan;
      user.subscriptionToken = customer.subscriptions.data[0].id;

      user.save(function(err) {
        if (err) {
          done(err);
        } else {
          done(null, user);
        }
      });

    }
  );
}

function createSubscription(user, plan, couponCode, done) {
  var options = {
    plan: plan
  };

  if (couponCode) options.coupon = couponCode;

  stripe.customers.createSubscription(
    user.customerToken,
    options,
    function(err, subscription) {
      if (err) done(err);

      user.subscriptionPlan = plan;
      user.subscriptionToken = subscription.id;

      user.save(function(err) {
        if (err) {
          done(err);
        } else {
          done(null);
        }
      });
    }
  );
}

function changeSubscription(user, plan, couponCode, done) {
  var options = {
    plan: plan
  };

  if (couponCode) options.coupon = couponCode;

  stripe.customers.updateSubscription(
    user.customerToken,
    user.subscriptionToken,
    options,
    function(err, subscription) {
      console.log(err);
      if (err) return done(err);

      user.subscriptionPlan = plan;
      user.subscriptionToken = subscription.id;

      user.save(function(err) {
        if (err) {
          done(err);
        } else {
          done(null, user);
        }
      });
    }
  );
}

exports.choosePlan = function(req, res, next) {
  var user = req.user;
  var plan = req.body.plan;
  var card = req.body.card;
  var couponCode = req.body.couponCode;

  if (!user.customerToken) {
    createCustomer(user, plan, card, couponCode, function(err) {
      if (err) {
        console.log(err);
          res.send(400, err);
        } else {
          res.jsonp(user);
        }
    });
  } else {
    if (!user.subscriptionToken) {
      createSubscription(user, plan, couponCode, function(err) {
        if (err) {
            res.send(400, err);
          } else {
            res.jsonp(user);
          }
      });
    }
    else {
      changeSubscription(user, plan, couponCode, function(err) {
        if (err) {
            res.send(400, err);
          } else {
            res.jsonp(user);
          }
      });
    }
  }
};

/**
 * Create a Customer
 */
exports.postSignup = function(req, res, next) {
  var user = req.user;
  var plan = req.body.subscriptionPlan;
  var card = req.body.stripeToken;

  async.waterfall([
      function(done) {
        createCustomer(user, plan, card, done);
      },
      function(user, done) { 
        req.login(user, function(err) {
          if (err) {
            res.send(400, err);
          } else {
            res.jsonp(user);
          }
        });
      },
      function(err) {
        res.send(400, err);
      }
  ]);

};


exports.createCustomer = createCustomer;


