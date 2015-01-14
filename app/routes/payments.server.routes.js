'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users'),
	    payments = require('../../app/controllers/payments');

    // Payments Routes
    app.route('/api/subscription/choose')
        .post(users.requiresLogin, payments.choosePlan);

};
