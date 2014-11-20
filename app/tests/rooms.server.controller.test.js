'use strict';

/**
 * Module dependencies.
 */
var request = require('supertest'),
  server = request.agent('http://localhost:3002'),
  should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Room = mongoose.model('Room');

/**
 * Globals
 */
var user, room ;

function loginUser(done) {
    function onResponse(err, res) {
       if (err) return done(err);
       return done();
    }

    return function(done) {
        // server
        //   .post('/auth/signin')
        //   .field('email', 'test@test.com')
        //   .field('password', 'password')
        //   //.send({ username: 'test@test.com', password: 'password' })
        //   .expect(302)
        //   .end(onResponse);
    };
}

/**
 * Unit tests
 */
describe.skip('Room Controller Unit Tests:', function() {
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
      room = {
        location: {
          country: 'België',
          city: 'Sint-Niklaas',
          street: 'Voskenslaan 5'
        },
        classification: 'room',
        leaseType: 'lease',
        user: user
      };

      done();
    });
  });

  describe('Method Save', function() {
    it('login', loginUser());
    it('should be able to save without problems', function(done) {
      // request(app)
      //   .post('/rooms')
      //   .send(room)
      //   .expect('Content-Type', /json/)
      //   .expect(200, done);
    });

  });

  afterEach(function(done) { 
    Room .remove().exec();

    User.remove().exec();
    done();
  });
});
