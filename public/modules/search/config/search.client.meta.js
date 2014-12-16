'use strict';

// Setting up route
angular.module('search').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/search/:address', {
            title: '1Roof - Zoeken in :address'
          });
    }
]);
