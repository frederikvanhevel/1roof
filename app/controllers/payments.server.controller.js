'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  config = require('../../config/config'),
  stripe = require('stripe')(config.stripe),
  _ = require('lodash');

/**
 * Create a Customer
 */
exports.subscribe = function(req, res, next) {
  var user = req.user;
  var plan = req.body.plan;
  var card = req.body.stripeToken;

  stripe.customers.create(
    { email: user.email, plan: plan, card: card },
    function(err, customer) {
      if (err) return next(err);
      user.customerToken = customer.id;

      user.save(function(err) {
        if (err) {
          console.log(err);
          return res.send(400);
        } else {
          res.send(200);
        }
      });

    }
  );
};
