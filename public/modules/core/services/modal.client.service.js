'use strict';

angular.module('core').service('Modal', [ '$modal', '$location',
  function($modal, $location) {
    var modalInstance;

    this.signup = function() {
      var options = {
        templateUrl: 'modules/users/views/signup.client.view.html',
        controller: 'AuthenticationController',
        windowClass: 'small'
      };

      return this.showModal(options, {});
    };

    this.signin = function() {
      var currentPath = $location.path();
      console.log(currentPath);

      var options = {
        templateUrl: 'modules/users/views/signin.client.view.html',
        controller: 'AuthenticationController',
        windowClass: 'small',
        resolve: {
          redirectTo: function () {
            return currentPath;
          }
        }
      };

      return this.showModal(options, {});
    };

    this.contact = function(info) {
      var options = {
        templateUrl: 'modules/rooms/views/modals/contact-modal.client.view.html',
        // controller: 'RoomsController',
        resolve: {
          contactInfo: function () {
            return info;
          }
        }
      };

      return this.showModal(options, {});
    };

    this.reservation = function(info) {
      var options = {
        templateUrl: 'modules/rooms/views/modals/reservation-modal.client.view.html',
        controller: 'ModalController',
        resolve: {
          modalContent: function () {
            return info;
          }
        }
      };

      return this.showModal(options, {});
    };

    this.changeAddress = function(addressDetails) {
      var options = {
        templateUrl: 'modules/rooms/views/modals/change-address-modal.client.view.html',
        controller: 'ManageRoomController',
        resolve: {
          addressDetails: function () {
            return addressDetails;
          }
        }
      };

      return this.showModal(options, {});
    };

    var modalDefaults = {
        backdrop: true,
        keyboard: true,
        modalFade: true,
        templateUrl: 'modules/core/views/modal.client.view.html'
    };

    var modalOptions = {
        closeButtonText: 'Close',
        actionButtonText: 'OK',
        headerText: 'Proceed?',
        bodyText: 'Perform this action?'
    };

    this.showModal = function (customModalDefaults, customModalOptions) {
        if (!customModalDefaults) customModalDefaults = {};
        return this.show(customModalDefaults, customModalOptions);
    };

    this.show = function (customModalDefaults, customModalOptions) {
        //Create temp objects to work with since we're in a singleton service
        var tempModalDefaults = {};
        var tempModalOptions = {};

        //Map angular-ui modal custom defaults to modal defaults defined in service
        angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);
        
        //Map modal.html $scope custom properties to defaults defined in service
        angular.extend(tempModalOptions, modalOptions, customModalOptions);

        if (!tempModalDefaults.controller) {
            tempModalDefaults.controller = function ($scope, $modalInstance) {
                $scope.modalOptions = tempModalOptions;
                $scope.modalOptions.ok = function (result) {
                    $modalInstance.close(result);
                };
                $scope.modalOptions.close = function (result) {
                    $modalInstance.dismiss('cancel');
                };
            };
        }

        return $modal.open(tempModalDefaults).result;
    };

  }
]);