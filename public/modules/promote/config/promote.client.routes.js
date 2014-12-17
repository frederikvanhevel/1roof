'use strict';

// Setting up route
angular.module('promote').config(['$stateProvider',
    function($stateProvider) {

        // Home state routing
        $stateProvider.
        state('promote', {
            url: '/promote',
            templateUrl: '/modules/promote/views/promote.client.view.html'
        });
    }
]);
