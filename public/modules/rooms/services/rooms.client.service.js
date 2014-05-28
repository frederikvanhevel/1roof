'use strict';

//Rooms service used to communicate Rooms REST endpoints
angular.module('rooms').factory('Rooms', ['$resource', function($resource) {
    return $resource('rooms/:roomId', {
        roomId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
        getMyRooms: {
            method:'GET',
            url: '/myrooms',
            isArray: true
        },
        getRoomsOfSameLocation: {
            method:'GET',
            url: 'rooms/:roomId/same',
            isArray: true
        },
        removeImage: {
            method:'POST',
            url: 'rooms/:roomId/removepicture'
        },
        sendMessage: {
            method:'POST',
            url: 'rooms/:roomId/sendmessage'
        }
    });
}]);