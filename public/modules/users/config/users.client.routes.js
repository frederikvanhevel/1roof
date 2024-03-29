'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
    function($stateProvider) {
        // Users state routing
        $stateProvider.
        state('profile', {
            url: '/settings/profile',
            templateUrl: '/modules/users/views/settings/edit-profile.client.view.html'
        }).
        state('password', {
            url: '/settings/password',
            templateUrl: '/modules/users/views/settings/change-password.client.view.html'
        }).
        state('accounts', {
            url: '/settings/accounts',
            templateUrl: '/modules/users/views/settings/social-accounts.client.view.html'
        }).
        state('signup', {
            url: '/signup',
            templateUrl: '/modules/users/views/signup.client.view.html'
        }).
        state('signin', {
            url: '/signin',
            templateUrl: '/modules/users/views/signin.client.view.html'
        }).
        state('forgot', {
            url: '/forgot',
            templateUrl: '/modules/users/views/forgot.client.view.html'
        }).
        state('reset', {
            url: '/reset/:token',
            templateUrl: '/modules/users/views/reset.client.view.html'
        }).
        state('dashboard', {
            url: '/dashboard/:nav',
            templateUrl: '/modules/users/views/dashboard.client.view.html'
        }).
        state('viewInbox', {
            url: '/dashboard/messages/:inboxId',
            templateUrl: '/modules/users/views/inbox.client.view.html',
            reloadOnSearch: false
        }).
        state('favorites', {
            url: '/users/:userId/favorites',
            templateUrl: '/modules/users/views/favorites.client.view.html'
        });
    }
]);
