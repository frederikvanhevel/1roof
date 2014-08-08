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
			password: 'password',
			provider: 'local'
		});

		user.save(function() { 
			room = new Room({
				surface: 30,
				price: {
					base: 450,
					period: 'month',
					egw: 50,
					cleaning: 10
				},
				amenities: ['pets'],
				info: {
					title: 'Test room',
					description: 'Description for test room'
				},
		    location: {
	        country: 'België',
	        city: 'Sint-Niklaas',
	        street: 'Voskenslaan 5'
		    },
		    loc: {
	        type: 'Point',
	        coordinates: [ 
	          4.160534200000029, 
	          51.1555844
	        ]
		    },
				available: {
					from: new Date(),
					till: new Date()
				},
				classification: 'room',
				leaseType: 'lease',
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

				should.equal(room.price.total, 510);

				done();
			});
		});

		it('should generate a slug based on certain properties', function(done) { 

		});
	});

	describe('Method Delete', function() {
		it('should be able to delete without problems', function(done) {

		});

		it('should remove all pictures from the hosting provider', function(done) { 

		});

		it('should remove the room id from users favorites', function(done) { 

		});
	});

	afterEach(function(done) { 
		Room .remove().exec();

		User.remove().exec();
		done();
	});
});