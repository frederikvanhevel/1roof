'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Room = mongoose.model('Room');

/**
 * Globals
 */
var user, room ;

/**
 * Unit tests
 */
describe('Room Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			room = new Room ({
				price: {
					base: 400,
					egw: 50
				},
				surface: 17,
				location: {
					street: 'Ekkergemstraat 17',
					city: 'Gent',
					country: 'België'
				},
				loc: {
					type: 'Point',
					coordinates: [3.709059400000001, 51.0526937]
				},
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return room .save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should calculate total price automatically based on other price fields', function(done) { 

			return room .save(function(err) {
				should.not.exist(err);

				should.equal(room.price.total, 450);

				done();
			});
		});
	});

	afterEach(function(done) { 
		Room .remove().exec();

		User.remove().exec();
		done();
	});
});