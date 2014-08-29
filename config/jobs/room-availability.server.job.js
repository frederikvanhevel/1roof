'use strict';

var mailer = require('../../app/util/mailer'),
  mongoose = require('mongoose'),
  winston = require('winston');

function checkRoom(room) {

  room.visible = false;

  var context = {
    user: room.user,
    room: room,
    editLink: '/#!/rooms/' + room._id + '/edit'
  };

  room.save(function(err) {
    if (!err) {
      if (room.user.settings.email.roomCheck) {
        winston.info('RoomCheck: Notifying user %s', room.user.displayName);
        mailer.send('expired-room.email.html', context, room.user.email, 'Advertentie verlopen');
      }
    }
  });

}

exports.run = function() {

  winston.info('Room availability check job started ..');

  var Room = mongoose.model('Room');

  var query = {
    'available.till': { $lt: new Date() },
    visible: true
  };

  Room.find(query).populate('user').exec(function(err, rooms) {
    winston.info('RoomCheck: %d rooms expired.', rooms.length);
    rooms.forEach(checkRoom);
  });

};