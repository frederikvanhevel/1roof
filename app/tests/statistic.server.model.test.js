'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Statistic = mongoose.model('Statistic');

/**
 * Globals
 */
var user, statistic;

/**
 * Unit tests
 */
describe('Statistic Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      password: 'password'
    });

    user.save(function() { 
      statistic = new Statistic ({
        // Add model fields
        // ...
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should aggregate views per day', function(done) {

    });
  });

  afterEach(function(done) { 
    Statistic.remove().exec();
    User.remove().exec();
    done();
  });
});