'use strict';

// Rooms controller
angular.module('rooms').controller('RoomsController', ['$rootScope', '$scope', '$stateParams', '$http', 'Authentication', 'Rooms', 'Amenity', 'Modal', 'Alert', 'Statistics', 'Meta', '$location', 'Enforcer', 'Analytics', 'gettext',
    function($rootScope, $scope, $stateParams, $http, Authentication, Rooms, Amenity, Modal, Alert, Statistics, Meta, $location, Enforcer, Analytics, gettext) {
        $scope.authentication = Authentication;

        $scope.contactInfo = {
            appointmentDate: new Date(),
            name: '',
            email: ''
        };
        $scope.currentDate = new Date();
        $scope.appointmentDate = new Date();
        $scope.otherRooms = [];
        $scope.amenities = Amenity.list();

        $scope.isOverlay = false;


        $scope.init = function() {
            $scope.findOne();
        };

        // Find existing Room
        $scope.findOne = function() {
            $scope.room = Rooms.get({
                roomId: $stateParams.roomId
            }, postLoad, loadFailure);
        };

        $scope.isAmenityChecked = function(room, amenity) {
            if ($scope.room.amenities)
                return room.amenities.indexOf(amenity.value) !== -1;
            else return false;
        };

        $scope.openReservationModal = function() {
            Enforcer.do(function() {
                Modal.reservation($scope.appointmentDate).then(sendReservation);
            });
        };

        $scope.openContactModal = function() {
            Enforcer.do(function() {
                Modal.contact($scope.contactInfo).then(sendMessage);
            });
        };

        $scope.toggleFavorite = function() {
            Enforcer.do(function() {
                sendFavorite();
            });
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

        $scope.visibilityText = function(item) {
            return item ? 'online' : 'offline';
        };

        $scope.setVisibility = function() {
            $http.put('/api/rooms/' + $scope.room._id, {
                visible: $scope.room.visible
            });
        };

        // helper for repeating something n number of times
        $scope.getNumber = function(num) {
            var obj = [];
            for (var i = 0; i < num; i++) {
                obj.push(i);
            }
            return obj;
        };

        $scope.getCostPeriod = function(period) {
            if (period === 'month') return gettext('per maand');
            else if (period === 'month') return gettext('per drie maand');
            else return gettext('per jaar');
        };

        function sendFavorite() {
            $http.post('/api/rooms/' + $scope.room._id + '/favorite').success(function(response) {
                var index = Authentication.user.favorites.indexOf($scope.room._id);
                if (index === -1) {
                    Statistics.aggregate($scope.room._id, 'favorites');

                    Authentication.user.favorites.push($scope.room._id);
                    Alert.add('success', gettext('Toegevoegd aan favorieten!'), 3000);

                    Analytics.trackEvent('Room', 'Favorite');
                } else {
                    Authentication.user.favorites.splice(index, 1);
                }
            }).error(function(response) {
                Alert.add('danger', gettext('Er was een probleem bij het toevoegen aan je favorieten, probeer later eens opnieuw.'), 5000);
            });
        }

        function sendMessage(message) {
            Statistics.aggregate($scope.room._id, 'messages');

            $http.post('/api/rooms/' + $scope.room._id + '/message', {
                message: message
            }).success(function(response) {
                Alert.add('success', gettext('Je bericht is verzonden!'), 5000);
                Analytics.trackEvent('Room', 'Message');
            }).error(function(response) {
                Alert.add('danger', gettext('Er was een probleem met het verzenden van je bericht, probeer later eens opnieuw.'), 5000);
            });
        }

        function sendReservation(extraMessage) {
            Statistics.aggregate($scope.room._id, 'reservations');

            $http.post('/api/rooms/' + $scope.room._id + '/message', {
                message: $scope.appointmentDate.getTime(),
                messageType: 'reservation'
            }).success(function(response) {
                if (extraMessage) sendMessage(extraMessage);
                else Alert.add('success', 'Je aanvraag is verzonden!', 5000);
                Analytics.trackEvent('Room', 'Reservation');
            }).error(function(response) {
                Alert.add('danger', gettext('Er was een probleem met het verzenden van je bericht, probeer later eens opnieuw.'), 5000);
            });
        }

        function postLoad() {
            if (!$scope.room.info.title) {
                Meta.add('/l/:roomId/:city/:title', {
                    title: '1roof - ' + $scope.room.location.street + ' - ' + $scope.room.location.city
                });
            } else {
                Meta.add('/l/:roomId/:city/:title', { 
                    title: '1roof - ' + $scope.room.info.title + ' - ' + $scope.room.location.city,
                    description: $scope.room.info.description
                });
            }
            
            // increment view count for statistics
            Statistics.aggregate($scope.room._id, 'views');

            $scope.otherRooms = Rooms.getRoomsOfSameLocation({
                roomId: $scope.room._id
            });
            $scope.$broadcast('room_loaded', $scope.room);
            if ($scope.room.pictures.length === 0) $scope.$emit('pictures_rendered');
        }

        function loadFailure(response) {
            $location.path('/rooms/notfound');
        }
    }
]);
