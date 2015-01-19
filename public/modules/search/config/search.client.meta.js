'use strict';

// Setting up route
angular.module('search').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/search/:address', {
            title: 'Huur een appartement, huis of kot in :address',
            description: 'Krijg een overzicht van alle appartementen, huizen, koten en nog veel meer in :address.'
          });
    }
]);
