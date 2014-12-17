'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Ad = mongoose.model('Ad'),
    _ = require('lodash'),
    config = require('../../config/config'),
    cloudinary = require('../../app/util/uploader'),
    mailer = require('../../app/util/mailer'),
    winston = require('winston');

/**
 * Create an Ad
 */
exports.create = function(req, res) {
    var ad = new Ad(req.body);
    ad.user = req.user;

    ad.save(function(err) {
        if (err) {
            winston.error('Error creating new ad', ad._id);
            return res.send(400);
        } else {
            res.jsonp(ad);
        }
    });
};

/**
 * Show the current Ad
 */
exports.read = function(req, res) {
    res.jsonp(req.ad);
};

/**
 * Update an Ad
 */
exports.update = function(req, res) {
    var ad = req.ad;

    ad = _.extend(ad, req.body);

    ad.save(function(err) {
        if (err) {
            winston.error('Error updating ad', ad._id);
            return res.send(400);
        } else {
            res.jsonp(ad);
        }
    });
};

/**
 * Delete an Ad
 */
exports.delete = function(req, res) {
    var ad = req.ad;

    ad.remove(function(err) {
        if (err) {
            winston.error('Error deleting ad', ad._id);
            return res.send(400);
        } else {
            res.jsonp(ad);
        }
    });
};

/**
 * List of Rooms
 */
exports.list = function(req, res) {
    Ad.find().exec(function(err, ads) {
        if (err) {
            winston.error('Error listing rooms');
            return res.send(400);
        } else {
            res.jsonp(ads);
        }
    });
};

/**
 * Ad middleware
 */
exports.adByID = function(req, res, next, id) {
    Ad.findById(id).exec(function(err, ad) {
        if (err) {
            winston.error('Error getting ad by id', id);
            return next(err);
        }
        if (!ad) {
            return res.send(404);
        }
        req.ad = ad;
        next();
    });
};

/**
 * Ad authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.ad.user.id !== req.user.id) {
        return res.send(403, 'User is not authorized');
    }
    next();
};
