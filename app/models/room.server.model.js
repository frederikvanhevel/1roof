'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Room Schema
 */
var RoomSchema = new Schema({
	surface: {
		type: Number,
		default: 0
	},
	price: {
		total: {
			type: Number,
			default: 0
		},
		base: {
			type: Number,
			default: 0
		},
		period: {
			type: String,
			enum: ['monthly', 'quarterly', 'yearly'],
			default: 'monthly'
		},
		egw: {
			type: Number,
			default: 0
		},
		cleaning: {
			type: Number,
			default: 0
		}
	},
	amenities: [String],
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
	available: {
		from: {
			type: Date,
			default: Date.now
		},
		till: {
			type: Date,
			default: Date.now
		}
	},
	classification: {
		type: String,
		enum: ['room', 'studio', 'appartment', 'house'],
		default: 'room'
	},
	leaseType: {
		type: String,
		enum: ['lease', 'sublease'],
		default: 'lease'
	},
	isLeased: {
		type: Boolean,
		default: false
	},
	pictures: [String],
	updated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	visible: {
		type: Boolean,
		default: false
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

RoomSchema.index({ loc: '2dsphere' });

/**
 * Hook a pre save method to update the updated date
 */
RoomSchema.pre('save', function(next) {
	this.updated = Date.now;
	next();
});

/**
 * Hook a pre save method to update the total price
 */
RoomSchema.pre('save', function(next) {
	this.price.total = this.price.base + this.price.egw + this.price.cleaning;
	next();
});


mongoose.model('Room', RoomSchema);