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
    everynight.minute = 0;
    everynight.second = 30;

    schedule.scheduleJob(everynight, roomAvailabilityCheckJob.run);
    schedule.scheduleJob(everynight, cacheJob.run);

    var everyMorning = new schedule.RecurrenceRule();
    everyMorning.hour = 7;
    everyMorning.minute = 0;
    everyMorning.second = 30;

    schedule.scheduleJob(everyMorning, messageCheckJob.run);

    var everyAfternoon = new schedule.RecurrenceRule();
    everyAfternoon.hour = 15;
    everyAfternoon.minute = 0;
    everyAfternoon.second = 30;

    schedule.scheduleJob(everyAfternoon, socialmediaJob.run);

    var everyMonth = new schedule.RecurrenceRule();
    everyMonth.dayOfMonth = 1;
    everyMonth.dayOfWeek = 0;
    everyMonth.hour = 10;
    everyMonth.minute = 0;
    everyMonth.second = 30;

    schedule.scheduleJob(everyMonth, facebook.extendToken);
};
