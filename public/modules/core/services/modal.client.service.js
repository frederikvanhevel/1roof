'use strict';

angular.module('core').service('Modal', [ '$modal',
  function($modal) {
    var modalInstance;

    this.signup = function() {
      var options = {
        templateUrl: 'modules/users/views/signup.client.view.html',
        controller: 'AuthenticationController',
        windowClass: 'small'
      };

      this.showModal(options, {}).then(function (result) {
        console.log(result);
      });
    };

    this.signin = function() {
      var options = {
        templateUrl: 'modules/users/views/signin.client.view.html',
        controller: 'AuthenticationController',
        windowClass: 'small'
      };

      this.showModal(options, {}).then(function (result) {
        console.log(result);
      });
    };

    this.contact = function(contactInfo) {
      var options = {
        templateUrl: 'modules/rooms/views/modals/contact-modal.view.client.html',
        controller: 'RoomsController',
        resolve: {
          contactInfo: function () {
            return contactInfo;
          }
        }
      };

      this.showModal(options, {}).then(function (result) {
        console.log(result);
      });
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