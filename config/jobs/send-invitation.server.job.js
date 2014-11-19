'use strict';

var mailer = require('../../app/util/mailer'),
  winston = require('winston');

exports.run = function() {

	var recipients = [
		'frederik.vanhevel@telenet.be'
	];

	recipients.forEach(function(recipient) {
		mailer.send('invitation.email.html', {}, recipient, 'Je bent uitgenodigd!');
	});

};
