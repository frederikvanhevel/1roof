'use strict';

var mongoose = require('mongoose'),
	Message = mongoose.model('Message'),
	UserMock = require('./user');

module.exports = function() {
	return new Message ({
		_id: '5454551',
		sender: new UserMock(),
		send: new Date(),
		isRead: false,
		messageType: 'default'
	});
};