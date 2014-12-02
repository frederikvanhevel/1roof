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
    var token = req.param('token');

    if (req.method == 'OPTIONS') {
        res.send(200);
    }
   
    if (token == config.CORStoken) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    }

    next();
};
