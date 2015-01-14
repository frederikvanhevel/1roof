'use strict';

var mailer = require('../../app/util/mailer'),
  mongoose = require('mongoose'),
  winston = require('winston'),
  _ = require('lodash');

function findNewRooms(user) {

    var userSettings = user.settings.alert.filters;

    var query = {
        created: { $lt: new Date(), $gt: new Date(new Date() - 604800000) }, // one week
        visible: true,
    };

    if (userSettings.location && userSettings.proximity) {
        query.loc = {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(userSettings.location[0]), parseFloat(userSettings.location[1])]
                }, $maxDistance: +userSettings.proximity
            }
        };
    }

    var Room = mongoose.model('Room');

    Room.find(query).exec(function(err, rooms) {
        if (rooms.length > 0) {
            var context = {
                  user: user,
                  rooms: _.first(rooms, 4) // limit rooms to 4
            };

            winston.info('NewRooms: Notifying user %s', user.displayName);
            mailer.send('new-rooms.email.html', context, user.email, 'Nieuwe advertenties');
        }
    });
}

exports.run = function() {

    winston.info('New rooms job started ..');

    var User = mongoose.model('User');

    var query = {
        'settings.email.newRooms': true
    };

    User.find(query).exec(function(err, users) {
        users.forEach(findNewRooms);
    });

};
