'use strict';

var schedule = require('node-schedule'),
    mailer = require('../app/util/mailer'),
    roomAvailabilityCheckJob = require('./jobs/room-availability-check'),
    roomPicturesCheckJob = require('./jobs/room-pictures-check'),
    messageCheckJob = require('./jobs/newmessage-check'),
    newRoomsJob = require('./jobs/new-rooms'),
    cacheJob = require('./jobs/cache');

exports.start = function() {

    var everynight = new schedule.RecurrenceRule();
    everynight.hour = 2;
    everynight.minute = 0;
    everynight.second = 30;

    schedule.scheduleJob(everynight, roomAvailabilityCheckJob.run);
    schedule.scheduleJob(everynight, cacheJob.run);

    var everyday = new schedule.RecurrenceRule();
    everyday.hour = 7;
    everyday.minute = 0;
    everyday.second = 30;

    schedule.scheduleJob(everyday, messageCheckJob.run);

    var weekly = new schedule.RecurrenceRule();
    weekly.dayOfWeek = 0;
    weekly.hour = 10;
    weekly.minute = 0;
    weekly.second = 30;

    // schedule.scheduleJob(weekly, newRoomsJob.run);
};
