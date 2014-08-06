'use strict';

var schedule = require('node-schedule'),
  mailer = require('../app/util/mailer');

exports.start = function() {
  mailer.send('layout.email.html', {}, 'noreply@apollo.be', 'frederik.vanhevel@telenet.be', 'subject');
};