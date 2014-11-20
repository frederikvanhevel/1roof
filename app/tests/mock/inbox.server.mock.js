'use strict';

var mongoose = require('mongoose'),
	Inbox = mongoose.model('Inbox'),
	UserMock = require('./user'),
	RoomMock = require('./room'),
	MessageMock = require('./message');

module.exports = function() {
	return new Inbox ({
		messages: [new MessageMock()],
		sender: new UserMock(),
		roomOwner: new UserMock(),
		updated: new Date(),
		room: new RoomMock()
	});
};