'use strict';

//Rooms service used to communicate Rooms REST endpoints
angular.module('rooms').factory('Rooms', ['$resource',
    function($resource) {
        return $resource('/api/rooms/:roomId', {
            roomId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            getLatestRooms: {
                method: 'GET',
                url: '/api/latestrooms',
                isArray: true
            },
            getMyRooms: {
                method: 'GET',
                url: '/api/myrooms',
                isArray: true
            },
            getRoomsOfSameLocation: {
                method: 'GET',
                url: '/api/rooms/:roomId/same',
                isArray: true
            }
        });
    }
]);
