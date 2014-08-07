'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Inbox = mongoose.model('Inbox'),
  Message = mongoose.model('Message'),
  Appointment = mongoose.model('Appointment'),
	_ = require('lodash'),
  winston = require('winston');


/**
 *  Add message to the current Inbox or create a new one
 */
exports.sendMessageOrCreate = function(req, res) {
  var room = req.room;

  var contents = {
    room: room._id,
    roomOwner: room.user._id,
    sender: req.user._id
  };

  var message = new Message({
    message: req.body.message,
    sender: req.user._id
  });

  if (req.body.messageType) message.messageType = req.body.messageType;

  Inbox.update(contents, { $addToSet: { messages: message }}, { upsert: true }, function(err) {
    if (err) {
      winston.error('Error saving new inbox', { inbox: contents, message: message });
      return res.send(400);
    } else {
      res.send(200);
    }
  });
};

/**
 *  Add message to the current Inbox
 */
exports.sendMessage = function(req, res) {
  var inbox = req.inbox;

  var message = new Message({
    message: req.body.message,
    sender: req.user._id
  });

  if (req.body.messageType) message.messageType = req.body.messageType;

  inbox.messages.push(message);

  inbox.save(function(err) {
    if (err) {
      return res.send(400);
    } else {
      req.io.sockets.in(inbox._id).emit('newMessage', message);

      res.jsonp(inbox);
    }
  });
};

/**
 *  Schedule an appointment
 */
exports.scheduleAppointment = function(req, res) {
  var inbox = req.inbox;

  var appointment = new Appointment({
    date: req.body.date,
    room: inbox.room
  });

  appointment.save(function(err) {
    if (err) {
      return res.send(400);
    } else {
      inbox.appointment = appointment;
      inbox.save(function(err) {
        if (err) {
          return res.send(400);
        } else {
          res.jsonp(inbox);
        }
      });
    }
  });
};

/**
 * Show the current Inbox
 */
exports.read = function(req, res) {
	res.jsonp(req.inbox);
};

/**
 * Update an Inbox
 */
exports.update = function(req, res) {
  var inbox = req.inbox;
  inbox = _.extend(inbox, req.body);

  inbox.save(function(err) {
    if (err) {
      return res.send(400);
    } else {
      res.jsonp(inbox);
    }
  });
};

/**
 * Delete an Inbox
 */
exports.delete = function(req, res) {
  var inbox = req.inbox;

  inbox.remove(function(err) {
    if (err) {
      return res.send(400);
    } else {
      res.jsonp(inbox);
    }
  });
};

/**
 * List of Inboxes
 */
exports.list = function(req, res) {
  var user = req.user;

  Inbox.find({ $or: [ {'sender': user._id }, { 'roomOwner': user._id } ] })
  .sort('-updated')
  .populate('sender').populate('roomOwner')
  .populate('room').exec(function(err, inboxes) {
    if (err) {
      return res.send(400);
    } else {
      res.jsonp(inboxes);
    }
  });
};

/**
 * Total unread messages for this user
 */
exports.getUnreadMessageCount = function(req, res) {
  var user = req.user;

  Inbox.count({ $or: [ {'sender': user._id }, { 'roomOwner': user._id } ], 'messages.sender': { $ne: user._id }, 'messages.isRead': false  })
  //.tailable().stream()
  //stream.on('data', function (doc) {
  //  socket.io emit event
  //});
  .exec(function(err, inboxes) {
    if (err) {
      return res.send(400);
    } else {
      res.jsonp(inboxes);
    }
  });
};

/**
 * Inbox middleware
 */
exports.inboxByID = function(req, res, next, id) {
  Inbox.findById(id).populate('room').populate('sender', 'displayName').populate('roomOwner', 'displayName')
  .exec(function(err, inbox) {
    if (err) return next(err);
    if (!inbox) return next(new Error('Failed to load Inbox ' + id));
    req.inbox = inbox;
    next();
  });
};

/**
 * Inbox authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.inbox.sender.id === req.user.id || req.inbox.roomOwner.id === req.user.id) next();
  else return res.send(403, 'User is not authorized');
};