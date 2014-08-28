'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Room = mongoose.model('Room'),
	crypto = require('crypto'),
	config = require('../../config/config'),
	stripe = require('stripe')(config.stripe.secretkey),
	winston = require('winston');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your first name']
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your last name']
	},
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		unique: 'testing error message',
		required: 'Please fill in an email',
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	username: {
		type: String,	
		trim: true
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	alerts: [new Schema({
		enabled: {
			type: Boolean,
			default: true
		},
		lastChecked: {
			type: Date,
			default: Date.now
		},
		filters: String
	}, {_id: false})],
	favorites: [{
		type: String,
		ref: 'Room'
	}],
	// For reset password
	resetPasswordToken: {
		type: String
	},
 	resetPasswordExpires: {
 		type: Date
 	},
 	// For stripe
 	customerToken: {
 		type: String
 	},
 	subscriptionToken: {
 		type: String
 	},
 	subscriptionPlan: {
 		type: String,
 		enum: ['FREE', 'PRO', 'BUSINESS'],
 		default: 'FREE'
 	},
 	settings: {
 		type: Object,
 		default: {
 			mails: {
 				roomCheck: true,
 				messageCheck: true
 			}
 		}
 	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

UserSchema.pre('remove', function (user) {
  Room.find({ '_id': { $in: user.favorites} }).remove(function(err) {
	  winston.error('Error removing rooms', err);
	});

	if (this.customerToken) {
		stripe.customers.del(
		  this.customerToken,
		  function(err, confirmation) {
		    if (err) winston.error('Error removing stripe customer', err);
		  }
		);
	}
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('User', UserSchema);