'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Appointment = mongoose.model('Appointment'),
	_ = require('lodash');

/**
 * Create a Appointment
 */
exports.create = function(req, res) {
  var appointment = new Appointment(req.body);

  appointment.save(function(err) {
    if (err) {
      return res.send(400);
    } else {
      res.jsonp(appointment);
    }
  });
};

/**
 * Show the current Appointment
 */
exports.read = function(req, res) {
	
};

/**
 * Update a Appointment
 */
exports.update = function(req, res) {
  var appointment = req.appointment;

  appointment = _.extend(appointment, req.body);

  appointment.save(function(err) {
    if (err) {
      return res.send(400);
    } else {
      res.jsonp(appointment);
    }
  });	
};

/**
 * Delete an Appointment
 */
exports.delete = function(req, res) {
	
};

/**
 * List of Appointments
 */
exports.list = function(req, res) {
	
};
