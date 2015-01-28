'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Room = mongoose.model('Room'),
    _ = require('lodash'),
    config = require('../../config/config'),
    cloudinary = require('../../app/util/uploader'),
    mailer = require('../../app/util/mailer'),
    winston = require('winston');

/**
 * Create a Room
 */
exports.create = function(req, res) {
    var room = new Room(req.body);
    room.user = req.user;

    room.save(function(err) {
        if (err) {
            winston.error('Error creating new room', room._id);
            return res.send(400);
        } else {
            var context = {
                user: req.user,
                room: room,
                editLink: '/rooms/' + room._id + '/edit/'
            };
            mailer.send('create-room.email.html', context, req.user.email, 'Advertentie aangemaakt!');

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
            return res.send(400);
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
            return res.send(400);
        } else {
            res.jsonp(room);
        }
    });
};

/**
 * List of Rooms
 */
exports.list = function(req, res) {
    res.setHeader('Cache-Control', 'public, max-age=1800000'); // 30 minute cache

    var params = req.query;
    var query = { visible: true };

    if (!params.location || !params.minPrice || !params.maxPrice || !params.proximity) {
        return res.send(405);
    }

    if (params.location) {
        if (typeof params.location === 'string') params.location = params.location.split(',');

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
            return res.send(400);
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
            return res.send(400);
        } else {
            res.jsonp(rooms);
        }
    });
};

exports.checkUserRoomsCount = function(req, res, next) {
    var user = req.user;

    res.send(200);

    // Room.count({ 'user': user }).exec(function(err, count) {
    //     if (err) {
    //         winston.error('Error getting user rooms count', user._id);
    //         return res.send(400);
    //     } else {
    //         if (count >= config.subscription[user.subscription.plan].maxRooms) {
    //             return res.send(403, 'User cannot create more rooms with this plan');
    //         } else {
    //             return res.send(200);
    //         }
    //     }
    // });
};

/**
 * List of other Rooms on location
 */
exports.listOfRoomsInSameLocation= function(req, res) {
    res.setHeader('Cache-Control', 'public, max-age=1800000'); // 30 minute cache

    var room = req.room;
    var query = {
        '_id': { $ne: room._id },
        'location.street': room.location.street,
        'location.city': room.location.city,
        'location.country': room.location.country,
        'visible': true
    };

    Room.find(query).exec(function(err, rooms) {
        if (err) {
            winston.error('Error getting rooms in same location', err);
            return res.send(400);
        } else {
            res.jsonp(rooms);
        }
    });
};

/**
 * List of similar Rooms
 */
exports.listOfSimilarRooms= function(req, res) {
    res.setHeader('Cache-Control', 'public, max-age=1800000'); // 30 minute cache

    var room = req.room;
    var query = {
        '_id': { $ne: room._id },
        'location.city': room.location.city,
        'location.country': room.location.country,
        'price.total': { $gte: room.price.total - 200, $lte: room.price.total + 200 },
        'pictures': {$not: {$size: 0}},
        'visible': true,
        'loc': {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: room.loc.coordinates
                }, $maxDistance: 10000
            }
        }
    };

    Room.find(query).limit(4).exec(function(err, rooms) {
        if (err) {
            winston.error('Error getting similar rooms', err);
            return res.send(400);
        } else {
            res.jsonp(rooms);
        }
    });
};


/**
 * Room middleware
 */
exports.roomByID = function(req, res, next, id) {
    Room.findById(id).populate('user', 'email').populate('user', 'firstName').exec(function(err, room) {
        if (err) {
            winston.error('Error getting room by id', id);
            return next(err);
        }
        if (!room) {
            // res.status(404).render('404', {
            //     url: req.originalUrl,
            //     error: 'Not Found'
            // });
            return res.send(404);
            // return next(new Error('Failed to load Room ' + id));
        }
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
            return res.send(400);
        } else {
            res.jsonp(rooms);
        }
    });
};

/**
 * Get latest rooms
 */
exports.getLatestRooms = function(req, res, next) {
    var user = req.user;
    var limit = req.query.limit || 10;

    Room.find({ pictures: {$not: {$size: 0}}, 'visible': true }).sort({updated:-1}).limit(limit).exec(function(err, rooms) {
        if (err) {
            winston.error('Error getting latest rooms', user._id);
            return res.send(400);
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
 * Room creation middleware
 */
exports.createRoomCheck = function(req, res, next) {
    var user = req.user;

    Room.count({ 'user': user }).exec(function(err, count) {
        if (err) {
            winston.error('Error getting user rooms count', user._id);
            return res.send(400);
        } else {
            if (count >= config.subscription[user.subscription.plan].maxRooms) {
                return res.send(403, 'User cannot create more rooms with this plan');
            } else {
                next();
            }
        }
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
