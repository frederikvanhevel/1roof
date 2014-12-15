'use strict';

var schedule = require('node-schedule'),
  mailer = require('../app/util/mailer'),
  roomAvailabilityCheckJob = require('./jobs/room-availability-check'),
  roomPicturesCheckJob = require('./jobs/room-pictures-check'),
  messageCheckJob = require('./jobs/newmessage-check'),
  newRoomsJob = require('./jobs/new-rooms'),
  cacheJob = require('./jobs/cache');

exports.start = function() {

  var everyday = new schedule.RecurrenceRule();
  everyday.hour = 2;

  schedule.scheduleJob(everyday, roomAvailabilityCheckJob.run);
  schedule.scheduleJob(everyday, cacheJob.run);

  var threedays = new schedule.RecurrenceRule();
  threedays.dayOfWeek = [1, 3, 5];
  threedays.hour = 12;
  threedays.minute = 0;

  schedule.scheduleJob(threedays, messageCheckJob.run);

  var weekly = new schedule.RecurrenceRule();
  weekly.dayOfWeek = 0;
  weekly.hour = 10;
  weekly.minute = 0;

  schedule.scheduleJob(weekly, newRoomsJob.run);
};