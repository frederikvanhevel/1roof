'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication', 'Geocoder', 'Alert', 'Meta',
    function($scope, $location, Authentication, Geocoder, Alert, Meta) {
        $scope.authentication = Authentication;

        $scope.search = '';
        $scope.searchDetails = {};

        Meta.setTitle('Apollo', true);

        $scope.goToSearch = function() {
            if ($scope.searchDetails.geometry) {
                changeLocation($scope.search.replace(/, /g, '--'), $scope.searchDetails.geometry.location.lat(), $scope.searchDetails.geometry.location.lng());
            } else {
                Geocoder.geocodeAddress($scope.search).then(function(result) {
                    changeLocation(result.formattedAddress.replace(/, /g, '--'), result.lat, result.lng);
                });
            }
            $scope.searchDetails = {};
        };

        function changeLocation(address, lat, lng) {
            $location.path('search/' + address)
                .search('lat', lat)
                .search('lng', lng);
        }

    }
]);
