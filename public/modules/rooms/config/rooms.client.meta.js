'use strict';

// Setting up route
angular.module('rooms').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/rooms/new', {
            title: '1Roof - Advertentie toevoegen'
          })

          .when('/rooms/:roomId/edit/:nav', {
            title: '1Roof - Advertentie aanpassen'
          })

          .when('/rooms/:roomId/analytics', {
            title: '1Roof - Analytics bekijken'
          })

          .when('/rooms/notfound', {
            title: '1Roof - Niet gevonden'
          });
    }
]);
