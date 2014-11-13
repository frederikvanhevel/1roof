'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.
        // state('home', {
        //     url: '/',
        //     templateUrl: '/modules/core/views/home.client.view.html'
        // }).
        state('comingsoon', {
            url: '/',
            templateUrl: '/modules/core/views/comingsoon.client.view.html'
        }).
        state('pricing', {
            url: '/pricing?coupon',
            params: {
                message: {
                    value: null
                },
                coupon: {
                    value: null
                }
            },
            templateUrl: '/modules/core/views/pricing.client.view.html'
        }).
        state('about', {
            url: '/about',
            templateUrl: '/modules/core/views/about.client.view.html'
        }).
        state('promote', {
            url: '/promote',
            templateUrl: '/modules/core/views/promote.client.view.html'
        });
    }
]);
