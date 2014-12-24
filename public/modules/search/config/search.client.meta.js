'use strict';

// Setting up route
angular.module('search').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/search/:address', {
            title: 'Huren in :address',
            description: 'Bekijk alle appartementen, huizen en koten in :address'
          });
    }
]);
