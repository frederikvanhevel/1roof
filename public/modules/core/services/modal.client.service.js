'use strict';

//Menu service used for managing  menus
angular.module('core').service('Modal', [ '$modal',
  function($modal) {
    this.signup = function() {
      var modalInstance = $modal.open({
        templateUrl: 'modules/users/views/signup.client.view.html',
        size: 'sm'
      });
    };

    this.signin = function() {
      var modalInstance = $modal.open({
        templateUrl: 'modules/users/views/signin.client.view.html',
        size: 'sm'
      });
    };
  }
]);