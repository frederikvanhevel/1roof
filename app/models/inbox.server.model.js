'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Inbox Schema
 */
var InboxSchema = new Schema({
  messages: [new Schema({
    message: String,
    sent: {
      type: Date,
      default: Date.now
    },
    sender: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }, {_id: false})],
  sender: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  roomOwner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  updated: {
    type: Date,
    default: Date.now
  },
  room: {
    type: Schema.ObjectId,
    ref: 'Room'
  }
});

InboxSchema.pre('save', function(next) {
  this.updated = Date.now();
  next();
});

mongoose.model('Inbox', InboxSchema);