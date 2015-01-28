'use strict';

// Setting up route
angular.module('users').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/settings/profile', {
            title: '1Roof - Profiel',
            description: ''
          })

          .when('/settings/password', {
            title: '1Roof - Wachtwoord',
            description: ''
          })

          .when('/signup', {
            title: '1Roof - Registreren',
            description: ''
          })

          .when('/signin', {
            title: '1Roof - Inloggen',
            description: ''
          })

          .when('/forgot', {
            title: '1Roof - Wachtwoord vergeten',
            description: ''
          })

          .when('/reset/:token', {
            title: '1Roof - Wachtwoord resetten',
            description: ''
          })

          .when('/dashboard/:nav', {
            title: '1Roof - Dashboard',
            description: ''
          })

          .when('/dashboard/messages/:inboxId', {
            title: '1Roof - Berichten',
            description: ''
          })

          .when('/users/:userId/favorites', {
            title: '1Roof - Wishlist bekijken',
            description: ''
          });

    }
]);
