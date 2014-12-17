'use strict';

// Setting up route
angular.module('promote').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/promote', {
            title: '1Roof - Je bedrijf adverteren'
          });
    }
]);
