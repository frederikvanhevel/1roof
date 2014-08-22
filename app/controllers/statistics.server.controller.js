'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Statistic = mongoose.model('Statistic'),
  _ = require('lodash'),
  winston = require('winston');


function getDateWithoutTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Aggregate a Statistic
 */
exports.aggregate = function(req, res) {
  var user = req.user;

  if (req.user && req.user._id.equals(req.room.user._id)) return res.send(200);

  var find = {
    date: getDateWithoutTime(new Date()),
    room: req.room._id
  };

  var increment = { $inc: {} };
  increment.$inc[req.body.type] = 1;

  Statistic.update(find, increment, { upsert: true }, function(err) {
    if (err) {
      winston.error('Error aggregating statistic', { query: find, type: req.body.type });
      return res.send(400);
    } else {
      res.send(200);
    }
  });

};

exports.lastMonth = function(req, res) {
  var room = req.room;

  var today = new Date();
  var query = {
    room: room,
    date: {
      $gte: today.setDate(today.getDate() - 30)
    }
  };

  Statistic.find(query).exec(function(err, statistics) {
    if (err) {
      winston.error('Error getting last month statistics', query);
      return res.send(400);
    } else {
      res.jsonp(statistics);
    }
  });
};