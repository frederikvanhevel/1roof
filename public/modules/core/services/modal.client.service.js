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

    this.contact = function(contactInfo) {
      this.closeInstance();
      modalInstance = $modal.open({
        templateUrl: 'modules/rooms/views/modals/contact-modal.view.client.html',
        controller: 'RoomsController',
        resolve: {
          contactInfo: function () {
            return contactInfo;
          }
        }
      });
    };

    this.closeInstance = function() {
      if (modalInstance) modalInstance.close();
      modalInstance = undefined;
    };
  }
]);