'use strict';

// Setting up route
angular.module('users').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/settings/profile', {
            title: '1Roof - Profiel'
          })

          .when('/settings/password', {
            title: '1Roof - Wachtwoord'
          })

          .when('/signup', {
            title: '1Roof - Registreren'
          })

          .when('/signin', {
            title: '1Roof - Inloggen'
          })

          .when('/forgot', {
            title: '1Roof - Wachtwoord vergeten'
          })

          .when('/reset/:token', {
            title: '1Roof - Wachtwoord resetten'
          })

          .when('/dashboard/:nav', {
            title: '1Roof - Dashboard'
          })

          .when('/dashboard/messages/:inboxId', {
            title: '1Roof - Berichten'
          })

          .when('/users/:userId/favorites', {
            title: '1Roof - Wishlist bekijken'
          });

    }
]);
