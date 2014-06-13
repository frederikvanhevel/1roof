'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Appointment Schema
 */
var AppointmentSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['undetermined', 'accepted', 'denied'],
    default: 'undetermined'
  },
  room: {
    type: Schema.ObjectId,
    ref: 'Room'
  },
  inbox: {
    type: Schema.ObjectId,
    ref: 'Inbox'
  }
});

mongoose.model('Appointment', AppointmentSchema);