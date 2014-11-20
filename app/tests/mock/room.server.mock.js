'use strict';

var mongoose = require('mongoose'),
	UserMock = require('./user'),
	Room = mongoose.model('Room');

module.exports = function() {
	return new Room({
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
		user: new UserMock()
	});
};