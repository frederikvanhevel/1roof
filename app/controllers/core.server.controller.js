'use strict';

/**
 * Module dependencies.
 */
var config = require('../../config/config');

exports.index = function(req, res) {

    if(process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect(config.app.host + req.url);
    } else {
        res.render('index', {
            user: req.user || null
        });
    }


};
