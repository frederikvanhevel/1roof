'use strict';

//Rooms service used to communicate Rooms REST endpoints
angular.module('promote').factory('Ads', ['$resource',
    function($resource) {
        return $resource('/api/ads/:adId', {
            adId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
