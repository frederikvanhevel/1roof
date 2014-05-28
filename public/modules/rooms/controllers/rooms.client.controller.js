'use strict';

// Rooms controller
angular.module('rooms').controller('RoomsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rooms', 'Geocoder',
    function($scope, $stateParams, $location, Authentication, Rooms, Geocoder) {
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
        $scope.busy = false;
        $scope.slideIndex = 0;
        $scope.otherRooms = [];

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

        // Remove existing Room
        $scope.remove = function(room) {
            if (room) {
                room.$remove();

                for (var i in $scope.rooms) {
                    if ($scope.rooms[i] === room) {
                        $scope.rooms.splice(i, 1);
                    }
                }
            } else {
                $scope.room.$remove(function() {
                    $location.path('rooms');
                });
            }
        };

        // Update existing Room
        $scope.update = function() {
            var room = $scope.room;

            room.$update(function() {
                $location.path('rooms/' + room._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        };

        // Find a list of Rooms
        $scope.find = function() {
            $scope.rooms = Rooms.query();
        };

        // Find existing Room
        $scope.findOne = function() {
            $scope.room = Rooms.get({
                roomId: $stateParams.roomId
            }, function() {
                $scope.otherRooms = Rooms.getRoomsOfSameLocation({
                    roomId: $scope.room._id
                });
            });
        };

        $scope.sendMessage = function() {
            $scope.room.$sendMessage({
                message: 'macheert da iere?'
            });
        };
    }
]);