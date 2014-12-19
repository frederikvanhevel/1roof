'use strict';

angular.module('core').controller('FooterController', ['$scope', '$rootScope', 'Rooms',
    function($scope, $rootScope, Rooms) {
        $scope.hidden = false;

        $rootScope.$on('hide_footer', function(event) {
            $scope.hidden = true;
        });

        $scope.init = function() {
        	$scope.latestRooms = Rooms.getLatestRooms({ limit: 4 });
        };

        $scope.getImageLink = function(picture) {
        	var url = '';

            if (picture.provider === 'cloudinary')
                url = 'https://res.cloudinary.com/dv8yfamzc/image/upload/w_200,h_200,c_fill/' + picture.link + '.png';
            else url = picture.link;

            return url;
        };

        $scope.getCurrentYear = function() {
            return new Date().getFullYear();
        };
    }
]);
