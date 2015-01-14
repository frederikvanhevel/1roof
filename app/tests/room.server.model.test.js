'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Room = mongoose.model('Room'),
    RoomMock = require('./mock/room');

/**
 * Globals
 */
var room ;

/**
 * Unit tests
 */
describe('Room Model Unit Tests:', function() {
    beforeEach(function() {
        room = new RoomMock();
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            return room.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should calculate total price automatically based on other price fields', function(done) {

            return room.save(function(err) {
                should.not.exist(err);

                should.equal(room.price.total, 510);

                done();
            });
        });

        it('should generate a slug based on certain properties', function(done) {
            return room.save(function(err) {
                var slug = 'sint-niklaas/test-room';

                should.equal(room.slug, slug);

                done();
            });
        });
    });

    describe('Method Delete', function() {

        beforeEach(function(done) {
            room.save(done);
        });


        it('should be able to delete without problems', function(done) {
            return room.remove(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it.skip('should remove all pictures from the hosting provider', function(done) {

        });

        it.skip('should remove the room id from users favorites', function(done) {
            room.user.favorites.push(room._id);

            return room.remove(function(err) {
                should(room.user.favorites).not.include(room._id);
                done();
            });
        });
    });

    afterEach(function(done) {
        room.remove();

        done();
    });
});
