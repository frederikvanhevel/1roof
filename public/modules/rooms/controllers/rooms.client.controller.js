'use strict';

// Rooms controller
angular.module('rooms').controller('RoomsController', ['$rootScope', '$window', '$scope', '$stateParams', '$location', '$http', 'Authentication', 'Rooms', 'Geocoder', 'Amenity', 'Modal', 'Alert',
    function($rootScope, $window, $scope, $stateParams, $location, $http, Authentication, Rooms, Geocoder, Amenity, Modal, Alert) {
        $scope.authentication = Authentication;

        $scope.contactInfo = {
            appointmentDate: new Date(),
            name: '',
            email: ''
        };
        $scope.appointmentDate = new Date();
        $scope.otherRooms = [];
        $scope.amenities = Amenity.list();

        $scope.isOverlay = false;

        $scope.init = function() {
            console.log('INIT ROOM');

            $scope.findOne();

            $scope.$watch('room', function(newValue, oldValue) {
                if (newValue !== oldValue) postLoad();
            });
        };

        // Find existing Room
        $scope.findOne = function() {
            $scope.room = Rooms.get({
                roomId: $stateParams.roomId
            }, postLoad);
        };

        $scope.isAmenityChecked = function(room, amenity) {
            if ($scope.room.amenities)
                return room.amenities.indexOf(amenity.value) !== -1;
            else return false;
        };

        $scope.openReservationModal = function() {
            var contactDetails = angular.copy($scope.contactInfo);
            contactDetails.appointmentDate = $scope.appointmentDate;

            if (!Authentication.user) {
                Modal.signup().then(function() {
                    Modal.reservation(contactDetails).then(sendMessage);
                });
            } else {
                Modal.reservation(contactDetails).then(sendMessage);
            }
        };

        $scope.openContactModal = function() {
            if (!Authentication.user) {
                Modal.signup().then(function() {
                    Modal.contact($scope.contactInfo).then(sendMessage);
                });
            } else {
                Modal.contact($scope.contactInfo).then(sendMessage);
            }
        };

        $scope.toggleFavorite = function() {
            console.log('elaa');
            if (!Authentication.user) {
                Modal.signup().then(function() {
                    sendFavorite();
                });
            } else {
                sendFavorite();
            }
        };

        $scope.isInfavorites = function() {
            if (Authentication.user)
                return Authentication.user.favorites.indexOf($scope.room._id) !== -1;
            else return false;
        };

        $scope.closeOverlay = function() {
            $rootScope.$broadcast('close_overlay');
        };

        $scope.isOverlay = function() {
            return $stateParams.isOverlay;
        };

        function sendFavorite() {
            $http.post('/rooms/' + $scope.room._id + '/favorite').success(function(response) {
                var index = Authentication.user.favorites.indexOf($scope.room._id);
                if (index === -1) {
                    Authentication.user.favorites.push($scope.room._id);
                    Alert.add('success', 'Added to favorites!', 3000);
                } else {
                    Authentication.user.favorites.splice(index, 1);
                }
            }).error(function(response) {
                Alert.add('danger', 'There was a problem adding this favorite, try again later.', 5000);
            });
        }

        function sendMessage(message) {
            $http.post('/rooms/' + $scope.room._id + '/message', { message: message }).success(function(response) {
                Alert.add('success', 'Your message has been sent!', 5000);
            }).error(function(response) {
                Alert.add('danger', 'There was a problem sending your message, try again later.', 5000);
            });
        }

        function postLoad() {
            $scope.otherRooms = Rooms.getRoomsOfSameLocation({
                roomId: $scope.room._id
            });
            $scope.$broadcast('room_loaded', $scope.room);
            if ($scope.room.pictures.length === 0) $scope.$emit('pictures_rendered');
        }
    }
]);