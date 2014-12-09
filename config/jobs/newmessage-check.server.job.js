'use strict';

var mailer = require('../../app/util/mailer'),
  mongoose = require('mongoose'),
  winston = require('winston');


function checkMessages(user) {
		var Inbox = mongoose.model('Inbox');

	  Inbox.count({ $or: [ {'sender': user._id }, { 'roomOwner': user._id } ], 'messages.sender': { $ne: user._id }, 'messages.isRead': false  })
	  .exec(function(err, count) {
	    if (err) return;
	    else {
	    	if (count > 0) {
	    		winston.info('MessageCheck: Notifying user %s', user.displayName);
	      	mailer.send('new-messages.email.html', { user: user }, user.email, 'Je hebt nieuwe berichten');
	    	}
	    }
	  });
}

exports.run = function() {

  	winston.info('Message check job started ..');

  	var User = mongoose.model('User');

    User.find().exec(function(err, users) {
	    users.forEach(checkMessages);
	  });

};