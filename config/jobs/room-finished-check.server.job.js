'use strict';

var mailer = require('../../app/util/mailer'),
  mongoose = require('mongoose'),
  winston = require('winston');

function getRoomErrors(room) {
    var errors = [];

    if (!room.info.title || room.info.title.trim() === '') errors.push('de titel');
    if (!room.price.base || room.price.base <= 0) errors.push('de kostprijs');
    if (!room.available.immediately && (!room.available.from || !room.available.till || new Date(room.available.till)) < new Date()) errors.push('de huurperiode');

    return errors;
}

function checkRoom(room) {
    if (!room.notifications) room.notifications = [];
    room.notifications.push('unfinished');

    var context = {
        user: room.user,
        room: room,
        errors: getRoomErrors(room),
        editLink: '/rooms/' + room._id + '/edit'
    };

    room.save(function(err) {
        if (err) {
            winston.error('RoomCheckJob: Error saving room %s', room._id);
        } else {
            winston.info('RoomCheck: Notifying user %s', room.user.displayName);
            mailer.send('not-finished.email.html', context, room.user.email, 'Advertentie onvolledig');
        }
    });
}

exports.run = function() {

    winston.info('Unfinished room check job started ..');

    var Room = mongoose.model('Room');

    // older than 12 hours
    var d = new Date();
    d.setHours(d.getHours() - 2);

    var query = {
        'isInOrder': false,
        'visible': false,
        'created': { $lt: d },
        'notifications': { $ne: 'unfinished' }
    };

    Room.find(query).populate('user').exec(function(err, rooms) {
        winston.info('RoomCheck: %d rooms unfinished.', rooms.length);
        rooms.forEach(checkRoom);
    });

};
