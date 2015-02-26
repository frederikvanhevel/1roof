'use strict';

// Rooms controller
angular.module('rooms').controller('ManageRoomController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rooms', 'UserSettings', '$window', 'Amenity', '$upload', '$http', 'Modal', 'Alert', 'gettext',
    function($scope, $stateParams, $location, Authentication, Rooms, UserSettings, $window, Amenity, $upload, $http, Modal, Alert, gettext) {
        $scope.authentication = Authentication;

        $scope.busy = false;
        $scope.nav = 'general';
        $scope.amenities = Amenity.list();
        $scope.errors = [];

        $scope.newAddress = '';
        $scope.newAddressDetails = {};

        $scope.guide = {
            enabled:  Authentication.user ? Authentication.user.settings.tutorial : true,
            step: 1
        };

        // Init
        $scope.init = function() {
            if ($stateParams.nav) $scope.nav = $stateParams.nav;
            if (!Authentication.user || !$stateParams.roomId) {
                $location.path('/');
                return;
            }

            $scope.room = Rooms.get({
                roomId: $stateParams.roomId
            }, postLoad, function() {
                // room not found, redirect
                $location.path('/dashboard/rooms');
            });

            $scope.$on('dropbox_chosen', onDropboxSelect);

            $scope.htmlReady(); 
        };

        $scope.guideEnded = function() {
            $scope.guide.enabled = false;
            UserSettings.set('tutorial', false);

            $scope.$apply();
        };

        // Update existing Room
        $scope.update = function() {
            $scope.room.$update(function() {
                flashSavedText();
            }, function(errorResponse) {
                Alert.add('danger', gettext('Er was een probleem bij het opslaan van je wijzigingen, probeer later opnieuw.'), 5000);
            });
        };

        $scope.onImageSelect = function($files) {
            $scope.busy = true;
            if ($files.length > 0) uploadImage($files[0]);
        };

        $scope.removeImage = function(index) {
            $scope.busy = true;

            $http.post('/api/rooms/' + $scope.room._id + '/removepicture', {
                index: index
            }).success(function(response) {
                $scope.room.pictures.splice(index, 1);
                $scope.busy = false;
            }).error(function(response) {
                Alert.add('danger', gettext('Er was een probleem bij het verwijderen van de afbeelding, probeer later opnieuw.'), 5000);
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
            $location.path('/rooms/' + $scope.room._id + '/edit/' + tab);
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
            Modal.confirm('room').then(function() {
                $scope.room.$remove(function() {
                    $location.path('/dashboard/rooms');
                });
            });
        };

        function postLoad() {
            if ($scope.room.user._id !== Authentication.user._id) $location.path('/');

            watchForUpdates();
        }

       function watchForUpdates () {
            $scope.$broadcast('room_loaded', $scope.room);
            checkRoomCompleteness();

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
                    checkRoomCompleteness();
                    updateFunction();
                }
            }, true);
        }

        function checkRoomCompleteness() {
            var errors = [];

            if (!$scope.room.info.title || $scope.room.info.title.trim() === '') errors.push('general');
            if (!$scope.room.price.base || $scope.room.price.base <= 0) errors.push('costs');
            if (!$scope.room.available.immediately && (!$scope.room.available.from || !$scope.room.available.till || new Date($scope.room.available.till)) < new Date()) errors.push('availability');

            $scope.errors = errors;
        }

        function uploadImage(image) {
            if ($scope.room.pictures.length === 8) return;

            $scope.busy = true;
            $upload.upload({
                url: '/api/rooms/' + $scope.room._id + '/upload',
                file: image
            }).success(function(data) {
                $scope.room.pictures.push({
                    provider: 'cloudinary',
                    link: data.id
                });
                $scope.busy = false;
            }).error(function(response) {
                $scope.busy = false;
                Alert.add('danger', gettext('Er was een probleem bij het toevoegen van de afbeelding, probeer later eens opnieuw.'), 5000);
            });
        }

        function onDropboxSelect(e, files) {
            if ($scope.room.pictures.length === 8) return;

            $scope.busy = true;
            files.forEach(function(file) {
                $http.post('/api/rooms/' + $scope.room._id + '/upload', {
                    link: file.link
                }).success(function(data) {
                    $scope.room.pictures.push({
                        provider: 'cloudinary',
                        link: data.id
                    });
                    $scope.busy = false;
                }).error(function(response) {
                    $scope.busy = false;
                    Alert.add('danger', gettext('Er was een probleem bij het toevoegen van de afbeelding, probeer later eens opnieuw.'), 5000);
                });
            });
        }

        function flashSavedText() {
            $scope.$broadcast('blink_text');
        }

    }
]);
