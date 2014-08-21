'use strict';

var schedule = require('node-schedule'),
  mailer = require('../app/util/mailer'),
  roomAvailabilityJob = require('./jobs/room-availability');

exports.start = function() {
  // mailer.send('welcome.email.html', {}, 'frederik.vanhevel@telenet.be', 'Welcome!');

  var rule = new schedule.RecurrenceRule();
  rule.hour = 2;

  var job = schedule.scheduleJob(rule, roomAvailabilityJob.run);

};