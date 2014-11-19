'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  config = require('../../config/config'),
  stripe = require('stripe')(config.stripe.secretkey),
  async = require('async'),
  BPromise = require('bluebird'),
  _ = require('lodash'),
  mailer = require('../util/mailer');


function createCustomer(user, plan, card, couponCode) {
  var defer = BPromise.defer();

  var options = {
    email: user.email,
    plan: plan
  };

  if (card) options.card = card;
  if (couponCode) options.coupon = couponCode;

  stripe.customers.create(options,
    function(err, customer) {
      if (err) return defer.reject(err);

      user.subscription.token = customer.id;
      user.subscription.plan = plan;
      user.subscription.token = customer.subscriptions.data[0].id;

      user.save(function(err) {
        if (err) {
          return defer.reject(err);
        } else {
          return defer.resolve(user);
        }
      });

    }
  );

  return defer.promise;
}

function createSubscription(user, plan, couponCode) {
  var defer = BPromise.defer();

  var options = {
    plan: plan
  };

  if (couponCode) options.coupon = couponCode;

  stripe.customers.createSubscription(
    user.subscription.customerToken,
    options,
    function(err, subscription) {
      if (err) return defer.reject(err);

      user.subscription.plan = plan;
      user.subscription.token = subscription.id;

      user.save(function(err) {
        if (err) {
          return defer.reject(err);
        } else {
          return defer.resolve(user);
        }
      });
    }
  );

  return defer.promise;
}

function changeSubscription(user, plan, couponCode) {
  var defer = BPromise.defer();

  var options = {
    plan: plan
  };

  if (couponCode) options.coupon = couponCode;

  stripe.customers.updateSubscription(
    user.subscription.customerToken,
    user.subscription.token,
    options,
    function(err, subscription) {
      if (err) return defer.reject(err);

      user.subscription.plan = plan;
      user.subscription.token = subscription.id;

      user.save(function(err) {
        if (err) {
          return defer.reject(err);
        } else {
          return defer.resolve(user);
        }
      });
    }
  );

  return defer.promise;
}

function sendSuccessMail(user) {
  var context = {
    user: user,
    changeLink: config.app.host + '/pricing'
  };
  mailer.send('subscription-changed.email.html', context, user.email, 'Tariefplan gewijzigd');
}

exports.choosePlan = function(req, res, next) {
  var user = req.user;
  var plan = req.body.plan;
  var card = req.body.card;
  var couponCode = req.body.couponCode;

  if (!user.customerToken) {

    createCustomer(user, plan, card, couponCode).then(function() {
      sendSuccessMail(user);
      res.jsonp(user);
    }).catch(function(err) {
      res.send(400, err);
    });

  } else {

    if (!user.subscription.token) {

      createSubscription(user, plan, couponCode).then(function() {
        sendSuccessMail(user);
        res.jsonp(user);
      }).catch(function(err) {
        res.send(400, err);
      });

    }
    else {

      changeSubscription(user, plan, couponCode).then(function() {
        sendSuccessMail(user);
        res.jsonp(user);
      }).catch(function(err) {
        res.send(400, err);
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

  createCustomer().then(function() {
    req.login(user, function(err) {
      if (err) {
        res.send(400, err);
      } else {
        res.jsonp(user);
      }
    });
  }).catch(function(err) {
    res.send(400, err);
  });

};


exports.createCustomer = createCustomer;


