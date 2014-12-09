'use strict';

var mailer = require('../../app/util/mailer'),
  winston = require('winston');

exports.run = function() {

	var recipients = [
		'frederik.vanhevel@telenet.be'
	];

	var i = 0;
	var gogo = setInterval(function() {

		if (i === recipients.length) {
			clearInterval(gogo);
			return;
		}

		console.log('Sending message to %s', recipients[i]);
		mailer.send('invitation.email.html', {}, recipients[i], 'Je bent uitgenodigd!');

		i++;

	}, 1500);

};
