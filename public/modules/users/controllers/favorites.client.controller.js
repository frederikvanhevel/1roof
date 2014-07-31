'use strict';

angular.module('users').controller('FavoritesController', ['$scope', '$http', '$location', '$stateParams', 'Authentication',
  function($scope, $http, $location, $stateParams, Authentication) {
    $scope.authentication = Authentication;
    $scope.favorites = [];

    $scope.busy = false;

    $scope.init = function() {
      $http.get('/users/' + $stateParams.userId).success(function(response) {
        $scope.user = response;
        getUserFavorites();
      });
    };


    function getUserFavorites() {
      $http.get('/users/' + $scope.user._id + '/favorites').success(function(response) {
          $scope.favorites = response;
          $scope.busy = false;
      }).error(function(response) {
          $scope.busy = false;
      });
    }

  }
]);