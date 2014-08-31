'use strict';

// Enforce user singup before callback
angular.module('users').service('UserSettings', [ 'Authentication', 'Users',
  function(Authentication, Users) {
    var user = Authentication.user;

    this.set = function(property, value, callback) {
      user.settings[property] = value;
      console.log(value);
      save(callback);
    };

    this.get = function(property) {
      return user.settings[property];
    };

    function save(callback) {
      var user = new Users(user);

      user.$update(function(response) {
        user = response;

        if (callback) callback(user);
      });
    }

  }
]);