'use strict';

// Rooms controller
angular.module('rooms').controller('ManageRoomController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rooms', 'Geocoder', '$timeout', '$window', 'Amenity', '$upload', '$http', 'Modal', 'Alert',
    function($scope, $stateParams, $location, Authentication, Rooms, Geocoder, $timeout, $window, Amenity, $upload, $http, Modal, Alert) {
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
        $scope.errors = [];

        $scope.newAddress = '';
        $scope.newAddressDetails = {};

         // Init
        $scope.init = function() {
            if ($stateParams.nav) $scope.nav = $stateParams.nav;
            if (!$stateParams.roomId) $location.path('/');

            $scope.room = Rooms.get({
                roomId: $stateParams.roomId
            }, $scope.watchForUpdates);
        };

        $scope.watchForUpdates = function() {
            $scope.$broadcast('room_loaded', $scope.room);
            $scope.checkRoomCompleteness();

            var updateFunction = $window._.debounce($scope.update, 1200);
            // Use watchGroup in angular 3.1
            $scope.$watch('room', function(newValue, oldValue) {
                if (newValue !== oldValue && !$scope.busy) {
                    $scope.checkRoomCompleteness();
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
            var room = angular.copy($scope.room);
            $scope.busy = true;
            console.log('updating');

            room.$update(function() {
                $scope.room = room;
                $scope.busy = false;
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                $scope.busy = false;
            });
        };

        $scope.onImageSelect = function($files) {
            if ($files.length > 0) $scope.uploadImage($files[0]);
        };

        $scope.onDropboxSelect = function(files) {
            console.log(files);
        };

        $scope.uploadImage = function(image) {
            $scope.busy = true;
            $upload.upload({
                url: 'rooms/' + $scope.room._id + '/upload',
                data: { index: $scope.room.pictures.length },
                file: image
            }).success(function(data, status, headers, config) {
                $scope.room.pictures.push(data.id);
                $scope.busy = false;
            }).error(function(response) {
                Alert.add('danger', 'There was a problem adding this picture, try again later.', 5000);
            });
        };

        $scope.removeImage = function(index) {
            $scope.busy = true;

            var room = angular.copy($scope.room);
            console.log('removing image');

            room.$removeImage({index: index, id: $scope.room.pictures[index]}).then(function(result) {
                $scope.room = result;
                $scope.busy = false;
            });
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

        $scope.checkRoomCompleteness = function() {
            var errors = [];

            if (!$scope.room.info.title || $scope.room.info.title === '') errors.push('general');
            if (!$scope.room.price.base || $scope.room.price.base === 0) errors.push('costs');
            if (!$scope.room.available.from) errors.push('availability');
            if (!$scope.room.available.till) errors.push('availability');

            console.log(errors);

            $scope.errors = errors;
        };

        $scope.tabHasError = function(tab) {
            console.log($scope.errors);
            return $scope.errors.indexOf(tab) !== -1;
        };

        $scope.openAddressMdoal = function() {
            Modal.changeAddress($scope.newAddressDetails).then(function(e) {
                console.log($scope.newAddressDetails);
            });
        };
    }
]);