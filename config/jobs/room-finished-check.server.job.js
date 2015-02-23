'use strict';

var mailer = require('../../app/util/mailer'),
  mongoose = require('mongoose'),
  winston = require('winston');

function checkRoom(room) {
    if (!room.notifications) room.notifications = [];
    room.notifications.push('unfinished');

    var context = {
        user: room.user,
        room: room,
        editLink: '/rooms/' + room._id + '/edit'
    };

    room.save(function(err) {
        if (err) {
            winston.error('RoomCheckJob: Error saving room %s', room._id);
        } else {
            if (room.user.settings.email.unfinishedCheck) {
                winston.info('RoomCheck: Notifying user %s', room.user.displayName);
                mailer.send('not-finished.email.html', context, room.user.email, 'Advertentie onvolledig');
            }
        }
    });
}

exports.run = function() {

    winston.info('Room finished check job started ..');

    var Room = mongoose.model('Room');

    var d = new Date();
    d.setDate(d.getDate() - 1);

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
