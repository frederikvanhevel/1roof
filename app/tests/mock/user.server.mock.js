'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = function() {
    return new User({
        firstName: 'Full',
        lastName: 'Name',
        displayName: 'Full Name',
        email: 'test@test.com',
        password: 'password',
        provider: 'local'
    });
};
