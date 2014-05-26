'use strict';

// Rooms controller
angular.module('rooms').controller('ManageRoomsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rooms', 'Geocoder', '$timeout', '$window',
    function($scope, $stateParams, $location, Authentication, Rooms, Geocoder, $timeout, $window) {
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
        $scope.nav = 'availability';

        
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

        // Init
        $scope.init = function() {
            if ($stateParams.nav) $scope.nav = $stateParams.nav;

            $scope.room = Rooms.get({
                roomId: $stateParams.roomId
            }, $scope.watchForUpdates);
        };

        $scope.watchForUpdates = function() {

            var updateFunction = $window._.debounce($scope.update, 500);
            $scope.$watch('room', function(newValue, oldValue) {
                if (newValue !== oldValue) updateFunction();
            }, true);
        };
    }
]);