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
    messageType: {
      type: String,
      enum: ['default', 'reservation', 'server'],
      default: 'default'
    }
}, { _id: false });

mongoose.model('Message', MessageSchema);