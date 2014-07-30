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
    sender: {
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
    },
    isServerMessage: {
      type: Boolean,
      default: false
    }
}, { _id: false });

mongoose.model('Message', MessageSchema);