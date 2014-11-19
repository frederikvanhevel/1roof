'use strict';

var schedule = require('node-schedule'),
  mailer = require('../app/util/mailer'),
  roomAvailabilityJob = require('./jobs/room-availability'),
  messageCheckJob = require('./jobs/newmessage-check'),
  newRoomsJob = require('./jobs/new-rooms'),
  invitationJob = require('./jobs/send-invitation');

exports.start = function() {

  var everyday = new schedule.RecurrenceRule();
  everyday.hour = 2;
  everyday.minute = 0;

  schedule.scheduleJob(everyday, roomAvailabilityJob.run);
  schedule.scheduleJob(everyday, messageCheckJob.run);


  var weekly = new schedule.RecurrenceRule();
  weekly.dayOfWeek = 0;
  weekly.hour = 10;
  weekly.minute = 0;

  schedule.scheduleJob(weekly, newRoomsJob.run);


  // invitationJob.run();

};