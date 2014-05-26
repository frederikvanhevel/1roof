'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Room = mongoose.model('Room'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Room already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Room
 */
exports.create = function(req, res) {
	var room = new Room(req.body);
	room.user = req.user;

	room.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(room);
		}
	});
};

/**
 * Show the current Room
 */
exports.read = function(req, res) {
	res.jsonp(req.room);
};

/**
 * Update a Room
 */
exports.update = function(req, res) {
	var room = req.room;

	room = _.extend(room, req.body);

	room.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(room);
		}
	});
};

/**
 * Delete an Room
 */
exports.delete = function(req, res) {
	var room = req.room;

	room.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(room);
		}
	});
};

/**
 * List of Rooms
 */
exports.list = function(req, res) {
	var params = req.query;
	var query = {};
	
	if (params.location) {
		query.loc = {
			$near: {
				$geometry: {
					type: 'Point',
					coordinates: [parseFloat(params.location[0]), parseFloat(params.location[1])]
				}, $maxDistance: +params.proximity  
			}
		};
	}
	if (params.minPrice && params.maxPrice) {
		query['price.total'] = { $gte: +params.minPrice, $lte: +params.maxPrice };
	}
	if (params.roomType) {
		params.roomType = params.roomType instanceof Array ? params.roomType : [params.roomType];
		query.classification = { $in: params.roomType };
	}

	Room.find(query).exec(function(err, rooms) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(rooms);
		}
	});
};

/**
 * List of User's Rooms
 */
exports.listOfUserRooms = function(req, res) {
	var user = req.user;
	Room.find({ user: user }).exec(function(err, rooms) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(rooms);
		}
	});
};

/**
 * List of other Rooms on location
 */
exports.listOfRoomsInSameLocation= function(req, res) {
	var room = req.room;
	var query = {
		'location.street': room.location.street,
		'location.city': room.location.city,
		'location.country': room.location.country
	};
	Room.find(query).exec(function(err, rooms) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(rooms);
		}
	});
};


/**
 * Room middleware
 */
exports.roomByID = function(req, res, next, id) {
	Room.findById(id).populate('user', 'displayName').exec(function(err, room) {
		if (err) return next(err);
		if (!room) return next(new Error('Failed to load Room ' + id));
		req.room = room;
		next();
	});
};

/**
 * Room authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.room.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};