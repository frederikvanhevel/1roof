'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication', 'Geocoder', 'Alert',
    function($scope, $location, Authentication, Geocoder, Alert) {
        $scope.authentication = Authentication;

        $scope.search = {
            input: '',
            details: {},
            autocompleteOptions: { types: '(cities)', country: 'be' }
        };

        $scope.init = function() {
            $scope.htmlReady(); 
        };

        $scope.goToSearch = function() {
            if ($scope.search.details.geometry) {
                changeLocation(
                    $scope.search.input.replace(/, /g, '--'),
                    $scope.search.details.geometry.location.lat(),
                    $scope.search.details.geometry.location.lng()
                );
            } else {
                Geocoder.geocodeAddress($scope.search.input).then(function(result) {
                    changeLocation(result.formattedAddress.replace(/, /g, '--'), result.lat, result.lng);
                });
            }
            $scope.search.details = {};
        };

        function changeLocation(address, lat, lng) {
            $location.path('search/' + address)
                .search('lat', lat)
                .search('lng', lng)
                .search('proximity', 3600);
        }

    }
]);
