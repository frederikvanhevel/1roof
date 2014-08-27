'use strict';

// Rooms controller
angular.module('rooms').controller('AnalyticsController', ['$rootScope', '$scope',  '$http', '$stateParams', 'Authentication', 'Rooms', 'Meta',
    function($rootScope, $scope, $http, $stateParams, Authentication, Rooms, Meta) {
        $scope.authentication = Authentication;

        $scope.statisticsData = [];

        Meta.setTitle('Analytics');

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
            $http.get('/statistics/' + $scope.room._id + '/lastmonth').success(function(response) {
                $scope.statisticsData = response;
            });
        }

    }
]);