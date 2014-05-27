'use strict';

angular.module('users').controller('DashboardController', ['$scope', '$stateParams', 'Rooms', 'Authentication',
	function($scope, $stateParams, Rooms, Authentication) {
        $scope.authentication = Authentication;
        $scope.nav = 'rooms';
        console.log(Authentication);

        // Init
        $scope.init = function() {
            if ($stateParams.nav) $scope.nav = $stateParams.nav;
        };

        $scope.getMyRooms = function() {
            $scope.myrooms = Rooms.getMyRooms();
        };
	}
]);