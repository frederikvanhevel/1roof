'use strict';

var mailer = require('../../app/util/mailer'),
    mongoose = require('mongoose'),
    winston = require('winston');

function checkRoom(room) {

    room.visible = false;

    var context = {
        user: room.user,
        room: room,
        editLink: '/rooms/' + room._id + '/edit'
    };


    if (room.user.settings.email.roomCheck) {
        winston.info('RoomCheck: Notifying user %s', room.user.displayName);
        mailer.send('no-pictures.email.html', context, room.user.email, 'Voeg een foto toe');
    }

}

exports.run = function() {

    winston.info('Room pictures check job started ..');

    var Room = mongoose.model('Room');

    var query = {
        pictures: [],
        visible: true
    };

    Room.find(query).populate('user').exec(function(err, rooms) {
        winston.info('RoomCheck: %d online rooms without pictures.', rooms.length);
        rooms.forEach(checkRoom);
    });

};
