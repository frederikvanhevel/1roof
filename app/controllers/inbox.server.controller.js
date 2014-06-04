'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Inbox = mongoose.model('Inbox'),
	_ = require('lodash');

/**
 * Create an Inbox
 
exports.create = function(req, res) {
  var inbox = new Inbox(req.body);
  inbox.sender = req.user;

  inbox.update(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(inbox);
    }
  });
};
*/

/**
 *  Add message to the current Inbox or create a new one
 */
exports.sendMessageOrCreate = function(req, res) {
  var room = req.room;
  var message = req.query;
  message.sender = req.user._id;

  var contents = {
    room: room._id,
    roomOwner: room.user._id,
    sender: req.user._id
  };

  Inbox.update(contents, { $addToSet: { messages: message }}, { upsert: true }, function(err) {
    if (err) {
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
  inbox.messages.push({
    message: req.query.message,
    sender: req.user
  });

  inbox.save(function(err) {
    if (err) {
      return res.send(400);
    } else {
      res.jsonp(inbox);
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
  .populate('sender', 'displayName').populate('roomOwner', 'displayName')
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