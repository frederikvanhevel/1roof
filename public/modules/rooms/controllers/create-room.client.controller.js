'use strict';

angular.module('rooms').controller('CreateRoomController', ['$scope', '$location', 'Authentication', 'Rooms', 'Modal', 'Geocoder', 'Meta',
	function($scope, $location, Authentication, Rooms, Modal, Geocoder, Meta) {
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

        $scope.init = function() {
            Meta.setTitle('Advertentie toevoegen');
            
            if (Authentication.user) $scope.creationStep = 2;
        };

        // Create new Room
        $scope.create = function() {

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
                $location.path('rooms/' + response._id + '/edit/');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            // Clear form fields
            $scope.createForm.address = '';
        };

        function doSearchLookup(address) {
          Geocoder.geocodeAddress(address).then(function(result) {

            // we need a valid street address
            if (result.accuracy < 7) return;

            $scope.addressDetails = {
                street: result.street + ' ' + result.streetNumber,
                city: result.city,
                country: result.country,
                geo: [ result.lng, result.lat ]
            };

            $scope.create();
          });
        }

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
	}
]);