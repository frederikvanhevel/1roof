'use strict';

angular.module('rooms').controller('CreateRoomController', ['$scope', '$location', 'Authentication', 'Rooms', 'Modal',
	function($scope, $location, Authentication, Rooms, Modal) {
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
            if (Authentication.user) $scope.creationStep = 2;
        };

        // Create new Room
        $scope.create = function() {

            if ($scope.addressDetails === null) {
                console.log('no details');
                return;
            }

            console.log($scope.addressDetails);

          // Create new Room object
            var room = new Rooms({
                price: {
                    base: Math.random()*400,
                    egw: Math.random()*100,
                    cleaning: Math.random()*30
                },
                location: {
                    street: $scope.addressDetails.street,
                    city: $scope.addressDetails.city,
                    country: $scope.addressDetails.country
                },
                loc: {
                    type: 'Point',
                    coordinates: $scope.addressDetails.geo
                },
                roomType: $scope.createForm.roomType
            });
            console.log($scope.room);

            // Redirect after save
            room.$save(function(response) {
                $location.path('rooms/' + response._id + '/edit/');
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            // Clear form fields
            $scope.createForm.address = '';
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
	}
]);