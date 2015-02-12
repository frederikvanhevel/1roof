'use strict';

var schedule = require('node-schedule'),
    mailer = require('../app/util/mailer'),
    roomAvailabilityCheckJob = require('./jobs/room-availability-check'),
    roomPicturesCheckJob = require('./jobs/room-pictures-check'),
    messageCheckJob = require('./jobs/newmessage-check'),
    newRoomsJob = require('./jobs/new-rooms'),
    cacheJob = require('./jobs/cache'),
    socialmediaJob = require('./jobs/social-media'),
    facebook = require('../app/util/facebook');

exports.start = function() {

    var everynight = new schedule.RecurrenceRule();
    everynight.hour = 2;

    schedule.scheduleJob(everynight, roomAvailabilityCheckJob.run);
    schedule.scheduleJob(everynight, cacheJob.run);

    var everyMorning = new schedule.RecurrenceRule();
    everyMorning.hour = 7;

    schedule.scheduleJob(everyMorning, messageCheckJob.run);

    var everyAfternoon = new schedule.RecurrenceRule();
    everyAfternoon.hour = 15;

    schedule.scheduleJob(everyAfternoon, socialmediaJob.run);

    var everyMonth = new schedule.RecurrenceRule();
    everyMonth.dayOfMonth = 1;

    schedule.scheduleJob(everyMonth, facebook.extendToken);
};
