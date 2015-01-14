'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    MessageMock = require('./mock/message'),
    Message = mongoose.model('Message');

/**
 * Globals
 */
var message;

/**
 * Unit tests
 */
describe('Message Model Unit Tests:', function() {
    beforeEach(function() {
        message = new MessageMock();
    });

    describe('Method Save', function() {
        it.skip('should be able to save without problems', function(done) {
            return message.save(function(err) {
                should.not.exist(err);
                done();
            });
        });
    });

    afterEach(function(done) {
        message.remove();
        done();
    });
});
