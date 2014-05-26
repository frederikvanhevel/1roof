'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var rooms = require('../../app/controllers/rooms');

	// Rooms Routes
	app.route('/rooms')
		.get(rooms.list)
		.post(users.requiresLogin, rooms.create);

	app.route('/myrooms')
		.get(users.requiresLogin, rooms.listOfUserRooms);
	
	app.route('/rooms/:roomId')
		.get(rooms.read)
		.put(users.requiresLogin, rooms.hasAuthorization, rooms.update)
	    .delete(users.requiresLogin, rooms.hasAuthorization, rooms.delete);

	app.route('/rooms/:roomId/same')
		.get(rooms.listOfRoomsInSameLocation);

	// Finish by binding the Room middleware
	app.param('roomId', rooms.roomByID);
};