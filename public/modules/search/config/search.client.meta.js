'use strict';

// Setting up route
angular.module('search').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/search/:address', {
            title: 'Zoeken in :address - 1Roof'
          });
    }
]);
