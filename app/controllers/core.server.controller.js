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

/**
 * Allow CORS for this endpoint if the right token is sent
 */
exports.allowCORS = function(req, res, next) {
    var params = req.query;
   
    // if (params.token && params.token === config.CORStoken) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    // }

    next();
};
