'use strict';

// Setting up route
angular.module('rooms').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/rooms/new', {
            title: '1roof - advertentie toevoegen'
          })

          .when('/rooms/:roomId/edit/:nav', {
            title: '1roof - advertentie aanpassen'
          })

          .when('/rooms/:roomId/analytics', {
            title: '1roof - analytics bekijken'
          })

          .when('/rooms/notfound', {
            title: '1roof - niet gevonden'
          });
    }
]);
