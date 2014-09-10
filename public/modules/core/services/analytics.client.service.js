'use strict';

angular.module('core').service('Analytics', ['$window', '$rootScope', '$location',
    function($window, $rootScope, $location) {

        var ga = $window.ga;

        this.initialize = function() {
            ga('create', 'UA-54653288-1', 'auto');   // production

            // ga('create', 'UA-54653288-1', { // localhost
            //     'cookieDomain': 'none'
            // });

            ga('send', 'pageview');

            $rootScope.$on('$stateChangeSuccess', function (event, toState) {
                ga('send', 'pageview', { page: $location.path(), title: toState.name });
            });
        };

        this.trackEvent = function(category, action, label, value) {
            if (!label && !value)
                ga('send', 'event', category, action);
            else if (label && !value)
                ga('send', 'event', category, action, label);
            else if (label && value)
                ga('send', 'event', category, action, label, value);
        };

        this.trackException = function(description, isFatal) {
            ga('send', 'exception', {
              'exDescription': 'DatabaseError',
              'exFatal': isFatal === undefined ? false : isFatal
            });
        };


    }
]);
