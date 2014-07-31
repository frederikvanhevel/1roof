'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication', 'Geocoder', 'Alert', 'gettextCatalog',
  function ($scope, $location, Authentication, Geocoder, Alert, gettextCatalog) {
    $scope.authentication = Authentication;

    gettextCatalog.currentLanguage = 'en';
    gettextCatalog.debug = true;

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