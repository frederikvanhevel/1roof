'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  config = require('../../config/config'),
  stripe = require('stripe')(config.stripe.secretkey),
  async = require('async'),
  _ = require('lodash');


function createCustomer(user, plan, card, done) {
  var options = {
    email: user.email,
    plan: plan
  };
  if (card) options.card = card;

  console.log(options);

  stripe.customers.create(options,
    function(err, customer) {
      console.log(customer);

      if (err) return done(err);
      console.log(err);

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

function createSubscription(user, plan, done) {
  stripe.customers.createSubscription(
    user.customerToken + '',
    { plan: plan },
    function(err, subscription) {
      if (err) done(err);

      console.log(user.customerToken);
      console.log(plan);
      console.log(subscription);
      user.subscriptionToken = subscription;

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

function changeSubscription(user, plan, done) {
  stripe.customers.updateSubscription(
    user.customerToken,
    user.subscriptionToken,
    { plan: plan },
    function(err, subscription) {
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

  console.log(plan);

  if (!user.customerToken) {
    console.log('no customerToken, creating customer');
    createCustomer(user, plan, card, function(err) {
      if (err) {
          res.send(400, err);
        } else {
          res.send(200);
        }
    });
  } else {
    if (!user.subscriptionToken) {
      console.log('has customerToken, creating subscription');
      createSubscription(user, plan, function(err) {
        if (err) {
            res.send(400, err);
          } else {
            res.send(200);
          }
      });
    }
    else {
      console.log('has subscription, changing');
      changeSubscription(user, plan, function(err) {
        if (err) {
            res.send(400, err);
          } else {
            res.send(200);
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


