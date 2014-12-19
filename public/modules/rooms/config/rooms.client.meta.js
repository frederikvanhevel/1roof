'use strict';

// Setting up route
angular.module('rooms').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/rooms/new', {
            title: 'Advertentie toevoegen - 1Roof'
          })

          .when('/rooms/:roomId/edit/:nav', {
            title: 'Advertentie aanpassen - 1Roof'
          })

          .when('/rooms/:roomId/analytics', {
            title: 'Analytics bekijken - 1Roof'
          })

          .when('/rooms/notfound', {
            title: 'Niet gevonden - 1Roof'
          });
    }
]);
