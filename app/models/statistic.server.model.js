'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Statistic Schema
 */
var StatisticSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    expires: '30d'
  },
  room: {
    type: String,
    ref: 'Room'
  },
  views: {
    type: Number,
    default: 0
  }
});

mongoose.model('Statistic', StatisticSchema);