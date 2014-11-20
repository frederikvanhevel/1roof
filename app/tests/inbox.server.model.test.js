'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	InboxMock = require('./mock/inbox'),
	Inbox = mongoose.model('Inbox');

/**
 * Globals
 */
var inbox;

/**
 * Unit tests
 */
describe('Inbox Model Unit Tests:', function() {
	beforeEach(function() {
		inbox = new InboxMock();
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return inbox.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		inbox.remove();

		done();
	});
});