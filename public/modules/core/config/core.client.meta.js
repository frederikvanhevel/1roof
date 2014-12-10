'use strict';

// Setting up route
angular.module('core').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/about', {
            title: '1roof - over ons'
          })

          .otherwise({
            title: '1roof - snel, makkelijk, krachtig',
            description: 'Zoek tussen alle koten in België. Vind de koten met beste prijs/kwaliteit. Zie echte fotos van oplijstingen',
            image: '/modules/core/img/brand/logo_wide.png'
          });
    }
]);
