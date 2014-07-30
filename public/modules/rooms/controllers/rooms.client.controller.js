'use strict';

// Rooms controller
angular.module('rooms').controller('RoomsController', ['$rootScope', '$window', '$scope', '$stateParams', '$location', '$http', 'Authentication', 'Rooms', 'Geocoder', 'Amenity', 'Modal',
    function($rootScope, $window, $scope, $stateParams, $location, $http, Authentication, Rooms, Geocoder, Amenity, Modal) {
        $scope.authentication = Authentication;

        $scope.contactInfo = {
            isTour: false,
            name: '',
            email: ''
        };
        $scope.slideIndex = 0;
        $scope.otherRooms = [];
        $scope.amenities = Amenity.list();

        $scope.isOverlay = false;

        // Find a list of Rooms
        $scope.find = function() {
            $scope.rooms = Rooms.query();
        };

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

        $scope.openContactModal = function() {
            if (!Authentication.user) {
                Modal.signup().then(function() {
                    Modal.contact($scope.contactInfo).then(sendMessage);
                });
            } else {
                Modal.contact($scope.contactInfo).then(sendMessage);
            }
        };

        $scope.closeOverlay = function() {
            $rootScope.$broadcast('close_overlay');
        };

        $scope.isOverlay = function() {
            return $stateParams.isOverlay;
        };

        function sendMessage(message) {
            $http.post('/rooms/' + $scope.room._id + '/message', { message: message }).success(function(response) {
                // notify
            }).error(function(response) {
                
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