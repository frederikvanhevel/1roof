'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageSchema = new Schema({
    message: String,
    from: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    to: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    sent: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
});

mongoose.model('Message', MessageSchema);