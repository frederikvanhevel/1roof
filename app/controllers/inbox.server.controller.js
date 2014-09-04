'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Inbox = mongoose.model('Inbox'),
  Message = mongoose.model('Message'),
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

  Inbox.update(contents, { $addToSet: { messages: message }}, { upsert: true }, function(err, inbox) {
    if (err) {
      winston.error('Error saving new inbox', { inbox: contents, message: message });
      return res.send(400);
    } else {

      if (!room.user._id.equals(req.user._id))
        req.io.sockets.in(room.user._id).emit('newMessageCount', { count: 1, inbox: inbox._id });

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
      winston.error('Error saving message', message);
      return res.send(400);
    } else {
      res.jsonp(inbox);

      var notifyUser = message.sender.equals(inbox.roomOwner._id) ? inbox.sender._id : inbox.roomOwner._id;

      req.io.sockets.in(inbox._id).emit('newMessage', message);
      req.io.sockets.in(notifyUser).emit('newMessageCount', { count: 1, inbox: inbox._id });
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
      winston.error('Error updating inbox', inbox._id);
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
      winston.error('Error deleting inbox', inbox._id);
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
  .populate('sender')
  .populate('roomOwner')
  .populate('room')
  .exec(function(err, inboxes) {
    if (err) {
      winston.error('Error listing inboxes of user', user._id);
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
  .exec(function(err, count) {
    if (err) {
      winston.error('Error getting unread messages count', user._id);
      return res.send(400);
    } else {
      res.jsonp(count);
    }
  });
};

/**
 * Inbox middleware
 */
exports.inboxByID = function(req, res, next, id) {
  Inbox.findById(id).populate('room').populate('sender', 'displayName').populate('roomOwner', 'displayName')
  .exec(function(err, inbox) {
    if (err) {
      winston.error('Error getting inbox by id', id);
      return next(err);
    }
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
