'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  StatisticMock = require('./mock/statistic'),
  Statistic = mongoose.model('Statistic');

/**
 * Globals
 */
var statistic;

/**
 * Unit tests
 */
describe('Statistic Model Unit Tests:', function() {
  beforeEach(function() {
    statistic = new StatisticMock();
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return statistic.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) { 
    statistic.remove();
    done();
  });
});