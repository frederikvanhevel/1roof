'use strict';

angular.module('core').controller('HomeController', ['$scope', '$location', 'Authentication', 'Geocoder', 'Alert', 'Meta',
    function($scope, $location, Authentication, Geocoder, Alert, Meta) {
        $scope.authentication = Authentication;

        $scope.search = {
            input: '',
            details: {},
            autocompleteOptions: { types: '(cities)', country: 'be' }
        };

        Meta.setTitle('1roof', true);

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
                .search('lng', lng);
        }

    }
]);
