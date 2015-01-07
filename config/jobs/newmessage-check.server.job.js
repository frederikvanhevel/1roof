'use strict';

var mailer = require('../../app/util/mailer'),
  mongoose = require('mongoose'),
  winston = require('winston');


function checkMessages(user) {
    var Inbox = mongoose.model('Inbox');

    var query = {
        $or: [ 
            { 'sender': user._id },
            { 'roomOwner': user._id }
        ],
        'messages.sender': { $ne: user._id },
        'messages.isRead': false,
        'messages.isNotified': false
    };

    Inbox.find(query).exec(function(err, inboxes) {
        if (err) return;
        else {
            if (inboxes.length > 0) {

                inboxes.forEach(function(inbox) {
                    inbox.messages.forEach(function(message) { message.isNotified = true; });
                    inbox.markModified('messages');
                    inbox.save();     
                });

                winston.info('MessageCheck: Notifying user %s', user.displayName);
                mailer.send('new-message.email.html', { user: user }, user.email, 'Je hebt nieuwe berichten');
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