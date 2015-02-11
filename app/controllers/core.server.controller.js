'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config');

exports.index = function(req, res) {
    res.render('index', {
        user: req.user || null,
        host: config.app.host,
        stripeKey: config.stripe.publickey
    });
};

exports.redirectIfHeroko = function(req, res, next) {
    if (req.header('host').indexOf('apollo2.herokuapp.com') !== -1) {
        res.redirect(301, 'https://1roof.be' + req.path);
    } else next();
};

/**
 * Allow CORS for this endpoint if the right token is sent
 */
exports.allowCORS = function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }

};

exports.runCacheJob  = function(req, res, next) {
    var cacheJob = require('../../config/jobs/cache');
    cacheJob.run();

    res.send(200);
};
