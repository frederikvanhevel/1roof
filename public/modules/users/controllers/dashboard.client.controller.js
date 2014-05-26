'use strict';

angular.module('users').controller('DashboardController', ['$scope', '$stateParams', 'Rooms',
	function($scope, $stateParams, Rooms) {
    $scope.nav = 'rooms';

    // Init
    $scope.init = function() {
        if ($stateParams.nav) $scope.nav = $stateParams.nav;
    };

    $scope.getMyRooms = function() {
        $scope.myrooms = Rooms.getMyRooms();
    };
	}
]);