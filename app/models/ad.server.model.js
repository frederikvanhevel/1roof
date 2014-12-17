'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	winston = require('winston');

/**
 * Ad Schema
 */
var AdSchema = new Schema({
	info: {
		title: {
			type: String,
			default: ''
		},
		description: {
			type: String,
			default: ''
		}
	},
	location: {
		street: {
			type: String,
			default: '',
			required: 'Please fill street name',
			trim: true
		},
		city: {
			type: String,
			default: '',
			required: 'Please fill city name',
			trim: true
		},
		country: {
			type: String,
			default: '',
			required: 'Please fill country name',
			trim: true
		}
	},
	loc: {
		type: { type: String },
		coordinates: [Number]
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

AdSchema.index({ loc: '2dsphere' });

mongoose.model('Ad', AdSchema);
