'use strict';

angular.module('users').factory('Inbox', ['$resource',
    function($resource) {
        return $resource('/api/inbox/:inboxId', {
            inboxId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            sendMessage: {
                method: 'POST',
                url: '/api/inbox/:inboxId/sendmessage'
            }
        });
    }
]);
