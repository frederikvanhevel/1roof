'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var rooms = require('../../app/controllers/rooms');
	var inbox = require('../../app/controllers/inbox');
	var cloudinary = require('../../app/util/uploader');

	// Rooms Routes
	app.route('/api/rooms')
		.get(rooms.allowCORS, rooms.list)
		.post(users.requiresLogin, rooms.createRoomCheck, rooms.create);

	app.route('/api/myrooms')
		.get(users.requiresLogin, rooms.listOfUserRooms);

	app.route('/api/roomcount')
		.get(users.requiresLogin, rooms.checkUserRoomsCount);

	// app.route('/l/:roomId/:city/:title')
	// 	.get(rooms.read);

	app.route('/api/rooms/:roomId')
		.get(rooms.read)
		.put(users.requiresLogin, rooms.hasAuthorization, rooms.update)
	    .delete(users.requiresLogin, rooms.hasAuthorization, rooms.delete);

  app.route('/api/rooms/:roomId/message')
    .post(users.requiresLogin, inbox.sendMessageOrCreate);

   app.route('/api/rooms/:roomId/favorite')
    .post(users.requiresLogin, rooms.toggleFavorite);

	app.route('/api/rooms/:roomId/same')
		.get(rooms.listOfRoomsInSameLocation);

	app.route('/api/rooms/:roomId/upload')
		.post(users.requiresLogin, rooms.hasAuthorization, cloudinary.upload);

	app.route('/api/rooms/:roomId/removepicture')
		.post(users.requiresLogin, rooms.hasAuthorization, rooms.removePicture);

	// Finish by binding the Room middleware
	app.param('roomId', rooms.roomByID);
};
