'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Statistic = mongoose.model('Statistic'),
  _ = require('lodash');


function getDateWithoutTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}


/**
 * Aggregate a Statistic
 */
exports.aggregate = function(req, res) {

  var find = {
    date: getDateWithoutTime(new Date()),
    room: req.room._id
  };

  var increment = {};
  increment.$inc[req.body.type] = 1;

  Statistic.update(find, increment, { upsert: true }, function(err) {
    if (err) {
      return res.send(400);
    } else {
      res.send(200);
    }
  });

};

