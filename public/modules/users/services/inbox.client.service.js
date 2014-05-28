'use strict';

angular.module('users').factory('Inbox', ['$resource', function($resource) {
    return $resource('inbox/:inboxId', {
        inboxId: '@_id'
    }, {
        update: {
            method: 'PUT'
        },
        sendMessage: {
            method:'POST',
            url: 'inbox/:inboxId/sendmessage'
        }
    });
}]);