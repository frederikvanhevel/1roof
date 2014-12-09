'use strict';

// Setting up route
angular.module('users').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/settings/profile', {
            title: '1roof - profiel'
          })

          .when('/settings/password', {
            title: '1roof - wachtwoord'
          })

          .when('/signup', {
            title: '1roof - registreren'
          })

          .when('/signin', {
            title: '1roof - inloggen'
          })

          .when('/forgot', {
            title: '1roof - wachtwoord vergeten'
          })

          .when('/reset/:token', {
            title: '1roof - wachtwoord resetten'
          })

          .when('/dashboard/:nav', {
            title: '1roof - dashboard'
          })

          .when('/dashboard/messages/:inboxId', {
            title: '1roof - berichten'
          })

          .when('/users/:userId/favorites', {
            title: '1roof - wishlist bekijken'
          });

    }
]);
