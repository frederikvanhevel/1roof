'use strict';

module.exports = function(app) {
  var users = require('../../app/controllers/users');
  var payments = require('../../app/controllers/payments');

  // Payments Routes
  app.route('/subscription/choose')
    .post(users.requiresLogin, payments.choosePlan);

};