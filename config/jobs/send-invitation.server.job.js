'use strict';

var mailer = require('../../app/util/mailer'),
  winston = require('winston');

exports.run = function() {

  mailer.send('invitation.email.html', {}, 'frederik.vanhevel@telenet.be', 'Je bent uitgenodigd!');

};
