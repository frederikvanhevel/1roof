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

            $scope.$on('dropbox_chosen', onDropboxSelect);
        };

        $scope.watchForUpdates = function() {
            $scope.$broadcast('room_loaded', $scope.room);
            $scope.checkRoomCompleteness();

            var updateFunction = $window._.debounce($scope.update, 1200);

            function watchRoomProperties() {
              return {
                visible: $scope.room.visible,
                pictures: $scope.room.pictures,
                leaseType: $scope.room.leaseType,
                available: $scope.room.available,
                loc: $scope.room.loc,
                location: $scope.room.location,
                info: $scope.room.info,
                amenities: $scope.room.amenities,
                price: $scope.room.price,
                surface: $scope.room.surface
              };
            }

            $scope.$watch(watchRoomProperties, function(newValue, oldValue) {
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
            // var room = angular.copy($scope.room);
            $scope.busy = true;
            console.log('updating');
            console.log($scope.room);
            $scope.room.$update(function() {
                // $scope.room = room;
                $scope.busy = false;
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
                $scope.busy = false;
            });
        };

        $scope.onImageSelect = function($files) {
            if ($files.length > 0) uploadImage($files[0]);
        };

        $scope.removeImage = function(index) {
            $scope.busy = true;

            $http.post('/rooms/' + $scope.room._id + '/removepicture', { index: index }).success(function(response) {
                $scope.room.pictures.splice(index, 1);
                $scope.busy = false;
            }).error(function(response) {
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
            return $scope.errors.indexOf(tab) !== -1;
        };

        $scope.openAddressModal = function() {
            var obj = {
                newAddress: $scope.newAddress,
                newAddressDetails: $scope.newAddressDetails
            };
            Modal.changeAddress(obj).then(function(e) {
                console.log(obj);
            });
        };

        $scope.setRoomVisible = function() {
            if ($scope.errors.length === 0) {
                $scope.room.visible = true;
                $location.path($scope.room.url);
            }
        };

        function uploadImage(image) {
            $scope.busy = true;
            $upload.upload({
                url: 'rooms/' + $scope.room._id + '/upload',
                data: { index: $scope.room.pictures.length },
                file: image
            }).success(function(data, status, headers, config) {
                $scope.room.pictures.push({
                    provider: 'cloudinary',
                    link: data.id
                });
                $scope.busy = false;
            }).error(function(response) {
                $scope.busy = false;
                Alert.add('danger', 'There was a problem adding this picture, try again later.', 5000);
            });
        }

        function onDropboxSelect(e, files) {
            $scope.busy = true;
            files.forEach(function(file) {
                $http.post('/rooms/' + $scope.room._id + '/upload', { link: file.link, index: $scope.room.pictures.length }).success(function(data) {
                    $scope.room.pictures.push({
                        provider: 'cloudinary',
                        link: data.id
                    });
                    $scope.busy = false;
                }).error(function(response) {
                    $scope.busy = false;
                    Alert.add('danger', 'There was a problem adding this picture, try again later.', 5000);
                });
            });
        }


    }
]);