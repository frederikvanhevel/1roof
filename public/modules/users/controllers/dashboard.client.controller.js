'use strict';

angular.module('users').controller('DashboardController', ['$scope', '$stateParams', '$location', 'Rooms', 'Authentication',
	function($scope, $stateParams, $location, Rooms, Authentication) {
        $scope.authentication = Authentication;
        $scope.nav = 'rooms';

        // Init
        $scope.init = function() {
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
	}
]);