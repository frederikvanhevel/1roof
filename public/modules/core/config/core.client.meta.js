'use strict';

// Setting up route
angular.module('core').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/about', {
            title: 'Over ons'
          })

          .otherwise({
            title: '1Roof - Vind je nieuwe woonst',
            description: 'Zoek tussen alle huurwoningen in België. Vind de panden met beste prijs/kwaliteit. Zie echte fotos van oplijstingen.',
            image: '/modules/core/img/brand/logo_big.png'
          });
    }
]);
