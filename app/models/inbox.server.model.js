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
    type: Schema.ObjectId,
    ref: 'Message'
  }],
  appointment : {
    type: Schema.ObjectId,
    ref: 'Appointment'
  },
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