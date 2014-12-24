'use strict';

// Setting up route
angular.module('rooms').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/rooms/new', {
            title: 'Advertentie toevoegen'
          })

          .when('/rooms/:roomId/edit/:nav', {
            title: 'Advertentie aanpassen'
          })

          .when('/rooms/:roomId/analytics', {
            title: 'Analytics bekijken'
          })

          .when('/rooms/notfound', {
            title: 'Niet gevonden'
          });
    }
]);
