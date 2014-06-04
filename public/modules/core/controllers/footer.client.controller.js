'use strict';

angular.module('core').controller('FooterController', ['$scope', '$rootScope',
  function($scope, $rootScope) {
    $scope.hidden = false;

    $rootScope.$on('hide_footer', function(event) {
      $scope.hidden = true;
    });
  }
]);