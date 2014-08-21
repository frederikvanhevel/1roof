'use strict';

var mailer = require('../../app/util/mailer'),
  mongoose = require('mongoose'),
  winston = require('winston');

mongoose.set('debug', true);

function checkRoom(room) {

  room.visible = false;

  var context = {
    user: room.user,
    room: room,
    editLink: 'http://' + req.headers.host + '/#!/rooms/' + room._id + '/edit'
  };

  room.save(function(err) {
    if (!err) {
      if (room.user.settings.mails.roomCheck) {
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
    winston.info('%d rooms expired. Notifying users ..', rooms.length);
    rooms.forEach(checkRoom);
  });

};