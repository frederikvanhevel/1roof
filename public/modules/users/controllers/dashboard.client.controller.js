'use strict';

angular.module('users').controller('DashboardController', ['$scope', '$stateParams', '$state', '$location', 'Rooms', 'Authentication',
    function($scope, $stateParams, $state, $location, Rooms, Authentication) {
        $scope.authentication = Authentication;
        $scope.nav = 'rooms';

        // If user is not signed in then redirect back home
        if (!Authentication.user) $location.path('/signin');

        // Init
        $scope.init = function() {
            if ($stateParams.nav) $scope.nav = $stateParams.nav;

            $scope.htmlReady(); 
        };

        $scope.getMyRooms = function() {
            $scope.myrooms = Rooms.getMyRooms();
        };

        $scope.setTab = function(tab) {
            $scope.nav = tab;
            $location.path('/dashboard/' + tab);
        };

        $scope.goToRoom = function(roomId) {
            $location.path('/rooms/' + roomId);
        };

        $scope.visibilityText = function(item) {
            return item ? 'online' : 'offline';
        };

        $scope.updateRoom = function(room) {
            room.$update();
        };

        $scope.viewAnalytics = function(room) {
            $location.path('/rooms/' + room._id + '/analytics');
            
            // if (Authentication.user.subscription.plan !== 'BUSINESS') {
            //     $state.transitionTo('pricing', {
            //         message: 'analytics'
            //     });
            // } else {
            //     $location.path('/rooms/' + room._id + '/analytics');
            // }
        };
    }
]);
