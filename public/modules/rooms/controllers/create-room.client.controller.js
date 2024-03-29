'use strict';

angular.module('rooms').controller('CreateRoomController', ['$rootScope', '$scope', '$location', '$state', 'Authentication', 'Rooms', 'Modal', 'Geocoder', '$http', 'Analytics', 'Alert', 'gettext',
    function($rootScope, $scope, $location, $state, Authentication, Rooms, Modal, Geocoder, $http, Analytics, Alert, gettext) {
        $scope.authentication = Authentication;

        $scope.createForm = {
            address: '',
            roomType: ''
        };
        $scope.autocompleteOptions = {
            country: 'be',
            watchEnter: true
        };
        $scope.addressDetails = null;
        $scope.creationStep = 1;
        $scope.busy = false;
        $scope.allowed = true;

        $scope.init = function() {
            if (Authentication.user) {
                $scope.creationStep = 2;
            }

            $rootScope.$on('logged_in', function(event) {
                $scope.creationStep = 2;
            });

            $scope.htmlReady(); 
        };

        // Create new Room
        $scope.create = function() {
            $scope.busy = true;

            // we need a roomType
            if (!$scope.createForm.roomType) return;

            if ($scope.addressDetails === null) {
                doSearchLookup($scope.createForm.address);
                return;
            }

            // Create new Room object
            var room = new Rooms({
                location: {
                    street: $scope.addressDetails.street,
                    city: $scope.addressDetails.city,
                    country: $scope.addressDetails.country
                },
                loc: {
                    type: 'Point',
                    coordinates: $scope.addressDetails.geo
                },
                classification: $scope.createForm.roomType
            });

            // Redirect after save
            room.$save(function(response) {
                Analytics.trackEvent('Room', 'Created', 'success');
                $location.path('/rooms/' + response._id + '/edit/');
            }, function(errorResponse) {
                Analytics.trackEvent('Room', 'Created', 'failure');
                Alert.add('danger', gettext('Er is iets misgelopen met het opslaan van de advertentie, probeer later opnieuw.'), 5000);
                $scope.busy = false;
            });
        };

        $scope.openSingupModal = function() {
            Modal.signup().then(function() {
                $scope.creationStep = 2;
            });
        };

        $scope.openSinginModal = function() {
            Modal.signin().then(function() {
                $scope.creationStep = 2;
            });
        };

        function doSearchLookup(address) {
            Geocoder.geocodeAddress(address).then(function(result) {

                // we need a valid street address
                if (result.accuracy < 7) return;

                $scope.addressDetails = {
                    street: result.street + ' ' + result.streetNumber,
                    city: result.city,
                    country: result.country,
                    geo: [result.lng, result.lat]
                };

                $scope.create();
            });
        }

        function checkUserRoomCount() {
            $http.get('/api/roomcount').success(function() {
                $scope.allowed = true;
            }).error(function(response) {
                $state.transitionTo('pricing', {
                    message: 'upgrade'
                });
            });
        }
    }
]);
