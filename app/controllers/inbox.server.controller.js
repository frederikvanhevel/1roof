'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
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
 *  Add message to the current Inbox
 */
exports.addMessage = function(req, res) {
  var room = req.room;
  inbox.update({ sender: req.user, room: room }, { $push: req.body }, { upsert: true }, function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
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
      return res.send(400, {
        message: getErrorMessage(err)
      });
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
      return res.send(400, {
        message: getErrorMessage(err)
      });
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

  Inbox.find({ $or: [ {'sender': user }, { 'room.user': user } ] }).exec(function(err, inboxes) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(inboxes);
    }
  });
};

/**
 * Inbox middleware
 */
exports.inboxByID = function(req, res, next, id) {
  Inbox.findById(id).exec(function(err, inbox) {
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
  if (req.inbox.sender.id !== req.user.id || req.inbox.room.user.id !== req.user.id) {
    return res.send(403, 'User is not authorized');
  }
  next();
};