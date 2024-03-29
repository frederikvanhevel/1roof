'use strict';

// Setting up route
angular.module('core').config([ 'MetaProvider',
    function(MetaProvider) {
        MetaProvider
          .when('/about', {
            title: 'Over ons',
            description: 'Meer informatie over 1roof'
          })

          .otherwise({
            title: '1Roof - Vind je nieuwe woonst',
            description: 'Zoek tussen alle huurwoningen in België en Nederland. Vind de panden met beste prijs/kwaliteit. Zie echte fotos van oplijstingen.',
            image: 'https://1roof.be/modules/core/img/brand/logo_big.png'
          });
    }
]);
