'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Room = mongoose.model('Room'),
	_ = require('lodash'),
	cloudinary = require('../../app/util/uploader'),
	mailer = require('../../app/util/mailer'),
  winston = require('winston');

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
			winston.error('Error creating new room', room._id);
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
			winston.error('Error updating room', room._id);
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
			winston.error('Error deleting room', room._id);
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
	var query = { visible: true };
	
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
	if (params.amenities) {
		params.amenities = params.amenities instanceof Array ? params.amenities : [params.amenities];
		query.amenities = { $all: params.amenities };
	}

	Room.find(query).exec(function(err, rooms) {
		if (err) {
			winston.error('Error listing rooms', query);
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
			winston.error('Error getting rooms of user', user._id);
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
		'_id': { $ne: room._id },
		'location.street': room.location.street,
		'location.city': room.location.city,
		'location.country': room.location.country
	};

	Room.find(query).exec(function(err, rooms) {
		if (err) {
			winston.error('Error getting rooms in same location', query);
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
		if (err) {
			winston.error('Error getting room by id', id);
			return next(err);
		}
		if (!room) return next(new Error('Failed to load Room ' + id));
		req.room = room;
		next();
	});
};

/**
 * Get a user's favorite rooms
 */
exports.getUserFavorites = function(req, res, next) {
	var user = req.user;

	Room.find({ '_id': { $in: user.favorites }, 'visible': true }).exec(function(err, rooms) {
		if (err) {
			winston.error('Error getting user favorites', user._id);
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(rooms);
		}
	});
};

/**
 * Toggle room favorite
 */
exports.toggleFavorite = function(req, res, next) {
	var user = req.user;
	var room = req.room;

	var index = user.favorites.indexOf(room._id);
	if (index === -1) {
		user.favorites.push(room._id);
	} else {
		user.favorites.splice(index, 1);
	}

	user.save(function(err) {
		if (err) {
			winston.error('Error toggling favortie', { userId: user._id, roomId: room._id });
			return res.send(400);
		} else {
			res.send(200);
		}
	});
};

/**
 * Remove picture
 */
exports.removePicture = function(req, res, next) {
	var room = req.room;

	var index = req.body.index;
	var picture = room.pictures[index];

	cloudinary.remove(req, res, next, index, function() {
		room.pictures.splice(index, 1);
		room.save(function(err) {
			if (err) {
				winston.error('Error removing picture', { roomId: room._id, pictureIndex: index });
				return res.send(400);
			} else {
				res.jsonp(room);
			}
		});
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