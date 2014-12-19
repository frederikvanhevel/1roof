'use strict';

// Setting up route
angular.module('promote').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/promote', {
            title: 'Je bedrijf adverteren - 1Roof'
          });
    }
]);
