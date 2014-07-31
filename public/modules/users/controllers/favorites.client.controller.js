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

    $scope.getUserPicture = function() {
      var pictureSrc = '';

      if ($scope.user.provider === 'local')
        pictureSrc = '/modules/core/img/default-user-icon.png';
      else if ($scope.user.provider === 'google')
        pictureSrc = $scope.user.providerData.picture;
      else if ($scope.user.provider === 'facebook')
        pictureSrc = $scope.user.providerData.picture;

      return { 'background-image': 'url(' + pictureSrc + ')' };
    };
  }
]);