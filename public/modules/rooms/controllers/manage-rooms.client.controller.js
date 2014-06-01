'use strict';

// Rooms controller
angular.module('rooms').controller('ManageRoomsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rooms', 'Geocoder', '$timeout', '$window', 'Amenity', '$upload', '$http',
    function($scope, $stateParams, $location, Authentication, Rooms, Geocoder, $timeout, $window, Amenity, $upload, $http) {
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
        $scope.nav = 'general';
        $scope.amenities = Amenity.list();

         // Init
        $scope.init = function() {
            if ($stateParams.nav) $scope.nav = $stateParams.nav;
            if (!$stateParams.roomId) $location.path('/');

            $scope.room = Rooms.get({
                roomId: $stateParams.roomId
            }, $scope.watchForUpdates);
        };

        $scope.watchForUpdates = function() {
            var updateFunction = $window._.debounce($scope.update, 1200);
            // Use watchGroup in angular 3.1
            $scope.$watch('room', function(newValue, oldValue) {
                if (newValue !== oldValue && !$scope.busy) {
                    console.log('eh?');
                    updateFunction();
                }
            }, true);
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
            $scope.busy = true;
            console.log('updating');

            room.$update(function() {
                //$location.path('rooms/' + room._id);
                $scope.busy = false;
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                $scope.busy = false;
            });
        };

        $scope.onImageSelect = function($files) {
            if ($files.length > 0) $scope.uploadImage($files[0]);
        };

        $scope.uploadImage = function(image) {
            $upload.upload({
                url: 'rooms/' + $scope.room._id + '/upload',
                data: { index: $scope.room.pictures.length },
                file: image
            }).success(function(data, status, headers, config) {
                $scope.room.pictures.push(data.id);
            });
        };

        $scope.removeImage = function(index) {
            var room = $scope.room;

            room.$removeImage({index: index, id: $scope.room.pictures[index]});
        };

        $scope.toggleAmenitySelection = function(amenity) {
            var idx = $scope.room.amenities.indexOf(amenity);

            if (idx > -1) {
              $scope.room.amenities.splice(idx, 1);
            } else {
              $scope.room.amenities.push(amenity);
            }
        };

        $scope.isAmenityChecked = function(amenity) {
            if ($scope.room.amenities)
                return $scope.room.amenities.indexOf(amenity) !== -1;
            else return false;
        };

        $scope.setTab = function(tab) {
            $scope.nav = tab;
            $location.path('rooms/' + $scope.room._id + '/edit/' + tab);
        };
    }
]);