'use strict';

angular.module('users').controller('DashboardController', ['$scope', '$stateParams', '$location', 'Rooms', 'Authentication', 'Meta',
	function($scope, $stateParams, $location, Rooms, Authentication, Meta) {
        $scope.authentication = Authentication;
        $scope.nav = 'rooms';

        // Init
        $scope.init = function() {
            Meta.setTitle('Dashboard');

            if ($stateParams.nav) $scope.nav = $stateParams.nav;
        };

        $scope.getMyRooms = function() {
            $scope.myrooms = Rooms.getMyRooms();
        };

        $scope.setTab = function(tab) {
            $scope.nav = tab;
            $location.path('dashboard/' + tab);
        };

        $scope.goToRoom = function(roomId) {
            $location.path('rooms/' + roomId);
        };

        $scope.visibilityText = function(item) {
            return item ? 'online' : 'offline';
        };

        $scope.updateRoom = function(room) {
            room.$update();
        };
	}
]);