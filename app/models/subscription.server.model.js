'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  config = require('../../config/config'),
  stripe = require('stripe')(config.stripe.secretkey),
  winston = require('winston');

/**
 * Subscription Schema
 */
var SubscriptionSchema = new Schema({
  customerToken: {
    type: String
  },
  token: {
    type: String
  },
  plan: {
    type: String,
    enum: ['FREE', 'PRO', 'BUSINESS'],
    default: 'FREE'
  },
});

SubscriptionSchema.pre('remove', function (user) {
  if (this.customerToken) {
    stripe.customers.del(
      this.customerToken,
      function(err, confirmation) {
        if (err) winston.error('Error removing stripe customer', err);
      }
    );
  }
});

mongoose.model('Subscription', SubscriptionSchema);
