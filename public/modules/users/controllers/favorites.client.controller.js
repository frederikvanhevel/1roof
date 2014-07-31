'use strict';

angular.module('users').controller('FavoritesController', ['$scope', '$http', '$location', '$stateParams', 'Authentication',
  function($scope, $http, $location, $stateParams, Authentication) {
    $scope.authentication = Authentication;
    $scope.favorites = [];

    $scope.init = function() {
      $http.get('/users/' + $stateParams.userId).success(function(response) {
        $scope.user = response;
      });
    };

  }
]);