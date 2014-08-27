'use strict';

// Enforce user singup before callback
angular.module('users').service('Enforcer', [ 'Authentication', 'Modal',
  function(Authentication, Modal) {

    this.do = function(callback) {
      if (!this.user) {
        Modal.signup().then(callback);
      } else {
        callback();
      }
    };

  }
]);