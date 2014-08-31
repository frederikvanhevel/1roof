'use strict';

var schedule = require('node-schedule'),
  mailer = require('../app/util/mailer'),
  roomAvailabilityJob = require('./jobs/room-availability'),
  messageCheckJob = require('./jobs/newmessage-check'),
  newRoomsJob = require('./jobs/new-rooms');

exports.start = function() {

  var everyday = new schedule.RecurrenceRule();
  everyday.hour = 2;

  schedule.scheduleJob(everyday, roomAvailabilityJob.run);
  schedule.scheduleJob(everyday, messageCheckJob.run);


  var weekly = new schedule.RecurrenceRule();
  everyday.dayOfWeek = 0;

  schedule.scheduleJob(weekly, newRoomsJob.run);

};