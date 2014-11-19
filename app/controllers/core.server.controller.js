'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config');

exports.index = function(req, res) {
    res.render('index', {
        user: req.user || null,
        stripeKey: config.stripe.publickey
    });
};
