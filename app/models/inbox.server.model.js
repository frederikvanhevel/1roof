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
  messages: [{
    message: String,
    sent: Date,
    sender: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  sender: {
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

mongoose.model('Inbox', InboxSchema);