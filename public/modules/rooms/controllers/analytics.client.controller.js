'use strict';

// Rooms controller
angular.module('rooms').controller('AnalyticsController', ['$scope', '$location', '$http', '$stateParams', 'Authentication', 'Rooms', 'Meta',
    function($scope, $location, $http, $stateParams, Authentication, Rooms, Meta) {
        $scope.authentication = Authentication;

        $scope.statisticsData = [];

        Meta.setTitle('Analytics');

        // If user is not signed in then redirect back home
        if (!Authentication.user) $location.path('/');

        $scope.init = function() {
            $scope.findOne();
        };

        // Find existing Room
        $scope.findOne = function() {
            $scope.room = Rooms.get({
                roomId: $stateParams.roomId
            }, getStatisticsData);
        };

        function getStatisticsData() {
            $http.get('/api/statistics/' + $scope.room._id + '/lastmonth').success(function(response) {
                $scope.statisticsData = response;
            });
        }

    }
]);
