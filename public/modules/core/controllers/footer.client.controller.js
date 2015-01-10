'use strict';

angular.module('core').controller('FooterController', ['$scope', '$rootScope', 'Rooms', 'gettext',
    function($scope, $rootScope, Rooms, gettext) {

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

        $scope.getClasification = function(room) {
            var classification = room.classification;
            if (classification === 'room') return gettext('Kamer');
            else if (classification === 'appartment') return gettext('Appartement');
            else return gettext('Huis');
        };

        $scope.getCurrentYear = function() {
            return new Date().getFullYear();
        };
    }
]);
