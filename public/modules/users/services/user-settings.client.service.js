'use strict';

// Enforce user singup before callback
angular.module('users').service('UserSettings', [ 'Authentication', 'Users',
  function(Authentication, Users) {
    var user = Authentication.user;

    this.set = function(property, value, callback) {
      setProperty(user.settings, property, value);

      save(callback);
    };

    this.get = function(property) {
      return user.settings[property];
    };

    function save(callback) {
      var usr = new Users(user);

      usr.$update(function(response) {
        user = response;

        if (callback) callback(user);
      });
    }

    function setProperty(obj, path, value) {
      var tags = path.split('.'), len = tags.length - 1;
      var current = tags[0];

      for (var i = 0; i < len; i++) {
        current = tags[i];

        if (obj[tags[i]] === undefined) {
          obj[tags[i]] = {};
        }

      }
      obj[current][tags[len]] = value;

      user.settings = obj;
    }

  }
]);