'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	shortId = require('shortid');

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

var slugify = function(text) {

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

/**
 * Room Schema
 */
var RoomSchema = new Schema({
	// custom short ids
	_id: {
    type: String,
    unique: true,
    'default': shortId.generate
	},
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
	pictures: [new Schema({
		provider: String,
		link: String
	}, {_id: false})],
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
	slug: {
		type: String
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

	// update 'updated' field
	this.updated = Date.now();

	// calculate total price
	this.price.total = this.price.base + this.price.egw + this.price.cleaning;

	// check if all necessary fields are filled in
	this.isInOrder = checkRoomCompleteness(this);

	// set the slug for seo purposes
	this.slug = slugify(this.location.city) + '/' + (this.info.title !== '' ? slugify(this.info.title) : slugify(this.location.street));

	next();
});

RoomSchema.virtual('url').get(function() {
  return '/l/' + this._id + '/' + this.slug;
});
// make sure the server sents our getter in the JSON object
RoomSchema.set('toJSON', { virtuals: true });

RoomSchema.index({ classification: 1, price: 1 }); // schema level


mongoose.model('Room', RoomSchema);