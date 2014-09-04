'use strict';

angular.module('core').service('Statistics', ['$http', 'localStorageService',
    function($http, localStorageService) {

        var uniqueViews = false;

        this.aggregate = function(roomId, type) {
            // type can be 'views', 'messages', 'reservations', 'favorites'

            if (uniqueViews) {
                var seenRooms = localStorageService.get('viewedRooms') || [];
                if (seenRooms.indexOf(roomId) === -1) {
                    postStatistic(roomId, type);
                    seenRooms.push(roomId);
                }
                localStorageService.set('viewedRooms', seenRooms);
            } else {
                postStatistic(roomId, type);
            }
        };

        function postStatistic(roomId, type) {
            $http.post('/statistics/' + roomId + '/aggregate', {
                type: type
            });
        }

    }
]);
