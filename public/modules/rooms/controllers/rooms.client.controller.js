'use strict';

// Rooms controller
angular.module('rooms').controller('RoomsController', ['$window', '$scope', '$stateParams', '$location', 'Authentication', 'Rooms', 'Geocoder', 'Amenity', 'Modal',
    function($window, $scope, $stateParams, $location, Authentication, Rooms, Geocoder, Amenity, Modal) {
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

            if ($scope.room) {
                $scope.isOverlay = true;
                $scope.postLoad();
            } else {
                $scope.findOne();
            }

            $scope.$watch('room', function(newValue, oldValue) {
                if (newValue !== oldValue) $scope.postLoad();
            });
        };

        // Find existing Room
        $scope.findOne = function() {
            $scope.room = Rooms.get({
                roomId: $stateParams.roomId
            }, $scope.postLoad);
        };

        $scope.postLoad = function() {
            $scope.otherRooms = Rooms.getRoomsOfSameLocation({
                roomId: $scope.room._id
            });
            $scope.$broadcast('room_loaded', $scope.room.loc);
            if ($scope.room.pictures.length === 0) $scope.$emit('pictures_rendered');
        };

        $scope.isAmenityChecked = function(room, amenity) {
            if ($scope.room.amenities)
                return room.amenities.indexOf(amenity.value) !== -1;
            else return false;
        };

        $scope.sendMessage = function() {
            $scope.room.$sendMessage({
                message: 'macheert da iere?'
            });
        };

        $scope.openContactModal = function() {
            Modal.contact($scope.contactInfo);
        };
    }
]);