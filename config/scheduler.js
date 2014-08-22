'use strict';

var schedule = require('node-schedule'),
  mailer = require('../app/util/mailer'),
  roomAvailabilityJob = require('./jobs/room-availability'),
  messageCheckJob = require('./jobs/newmessage-check');

exports.start = function() {

  var rule = new schedule.RecurrenceRule();
  //rule.hour = 2;
  rule.second = 20;

  schedule.scheduleJob(rule, roomAvailabilityJob.run);
  schedule.scheduleJob(rule, messageCheckJob.run);

};