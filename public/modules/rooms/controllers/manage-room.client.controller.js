'use strict';

// Rooms controller
angular.module('rooms').controller('ManageRoomController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rooms', 'Geocoder', '$timeout', '$window', 'Amenity', '$upload', '$http', 'Modal', 'Alert', 'Meta',
    function($scope, $stateParams, $location, Authentication, Rooms, Geocoder, $timeout, $window, Amenity, $upload, $http, Modal, Alert, Meta) {
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
            Meta.setTitle('Advertentie aanpassen');

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

            var updateFunction = $window._.debounce($scope.update, 800);

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
                surface: $scope.room.surface,
                cohabit: $scope.room.cohabit
              };
            }

            $scope.$watch(watchRoomProperties, function(newValue, oldValue) {
                if (newValue !== oldValue && !$scope.busy) {
                    $scope.checkRoomCompleteness();
                    updateFunction();
                }
            }, true);
        };

        // Update existing Room
        $scope.update = function() {
            $scope.room.$update(function() {
                flashSavedText();
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
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
            if (!$scope.room.available.immediately && (!$scope.room.available.from || !$scope.room.available.till || new Date($scope.room.available.till)) < new Date()) errors.push('availability');

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
            Modal.changeAddress(obj).then(function(result) {
                $scope.room.location = {
                    street: result.street + ' ' + result.streetNumber,
                    city: result.city,
                    country: result.country
                };
                $scope.room.loc = {
                    type: 'Point',
                    coordinates: result.geo
                };
                $scope.$broadcast('room_loaded', $scope.room);
            });
        };

        $scope.visibilityText = function(item) {
            return item ? 'online' : 'offline';
        };

        $scope.deleteRoom = function() {
            Modal.confirm().then(function() {
                $scope.room.$remove(function() {
                    $location.path('/dashboard/rooms');
                });
            });
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
                Alert.add('danger', 'Er was een probleem bij het toevoegen van de afbeelding, probeer later eens opnieuw.', 5000);
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
                    Alert.add('danger', 'Er was een probleem bij het toevoegen van de afbeelding, probeer later eens opnieuw.', 5000);
                });
            });
        }

        function flashSavedText() {
            $scope.$broadcast('blink_text');
        }

    }
]);