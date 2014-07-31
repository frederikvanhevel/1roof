'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Check if enough details are filled in
 */
var checkRoomCompleteness = function(room) {
	var complete = true;
	
	if (!room.info.title || room.info.title === '') complete = false;
  if (!room.price.base || room.price.base === 0) complete = false;
  if (!room.available.from) complete = false;
  if (!room.available.till) complete = false;

  // Room is incomplete so can't be visible
  if (!complete) room.visible = false;

  return complete;
};

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
			enum: ['month', 'quarter', 'year'],
			default: 'month'
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
	pictures: [{
		provider: String,
		link: String
	}],
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
	isInOrder: {
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
 * Hook a pre save method to update the total price and set updated date
 */
RoomSchema.pre('save', function(next) {
	this.updated = Date.now();
	this.price.total = this.price.base + this.price.egw + this.price.cleaning;
	this.isInOrder = checkRoomCompleteness(this);

	next();
});


mongoose.model('Room', RoomSchema);