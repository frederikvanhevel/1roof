'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication', 'Geocoder',
  function ($scope, $location, Authentication, Geocoder) {
    $scope.authentication = Authentication;

    $scope.search = '';
    $scope.searchDetails = {};

    $scope.goToSearch = function() {
      if ($scope.searchDetails.geometry) {
        $location.path('search/' + $scope.search.replace(/, /g, '--'))
          .search('lat', $scope.searchDetails.geometry.location.lat())
          .search('lng', $scope.searchDetails.geometry.location.lng());
      } else {
        Geocoder.geocodeAddress($scope.search).then(function(result) {
          $location.path('search/' + result.formattedAddress.replace(/, /g, '--'))
            .search('lat', result.lat)
            .search('lng', result.lng);
        });
      }
      $scope.searchDetails = {};
    };
}]);