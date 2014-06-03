'use strict';

angular.module('core').service('Modal', [ '$modal',
  function($modal) {
    var modalInstance;
    this.signup = function() {
      this.closeInstance();
      modalInstance = $modal.open({
        templateUrl: 'modules/users/views/signup.client.view.html',
        size: 'sm'
      });
    };

    this.signin = function() {
      this.closeInstance();
      modalInstance = $modal.open({
        templateUrl: 'modules/users/views/signin.client.view.html',
        size: 'sm'
      });
    };

    this.contact = function() {
      this.closeInstance();
      modalInstance = $modal.open({
        templateUrl: 'modules/rooms/views/contact-modal.view.client.html'
      });
    };

    this.closeInstance = function() {
      if (modalInstance) modalInstance.close();
    };
  }
]);