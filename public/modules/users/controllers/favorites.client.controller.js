'use strict';

angular.module('users').controller('FavoritesController', ['$scope', '$http', '$location', '$stateParams', 'Authentication',
  function($scope, $http, $location, $stateParams, Authentication) {
    $scope.authentication = Authentication;
    $scope.favorites = [];

    // Find existing Room
    $scope.getFavoriteRooms = function(inboxId) {
      $http.get('/users/' + $stateParams.userId + '/favorites').success(function(response) {
        $scope.favorites = response;
      });
    };
  }
]);