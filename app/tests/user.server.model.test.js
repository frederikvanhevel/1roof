'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    UserMock = require('./mock/user');

/**
 * Globals
 */
var user, user2;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {
    before(function() {
        user = new UserMock();
    });

    describe('Method Save', function() {
        it('should begin with no users', function(done) {
            User.find({}, function(err, users) {
                users.should.have.length(0);
                done();
            });
        });

        it('should be able to save without problems', function(done) {
            user.save(done);
        });

        it('should fail to save an existing user again', function(done) {
            user.save();

            var user2 = new UserMock();

            return user2.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without first name', function(done) {
            user.firstName = '';
            return user.save(function(err) {
                should.exist(err);
                done();
            });
        });
    });

    after(function(done) {
        User.remove().exec();
        done();
    });
});
