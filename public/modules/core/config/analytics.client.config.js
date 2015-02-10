'use strict';

// Setting up route
angular.module('core').config(['AnalyticsProvider',
    function(AnalyticsProvider) {
        AnalyticsProvider.setAccount('UA-54653288-1');

        AnalyticsProvider.trackPages(true);

        AnalyticsProvider.useAnalytics(true);

        AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    }
]).run(['$window', 'Meta',
    function($window, Meta) {
        // Init meta stuff
        Meta.init();

        //Init maps
        $window.L.mapbox.accessToken = 'pk.eyJ1IjoiZGVmcmVlayIsImEiOiJzN2k4MTJ3In0.T9XzqH8K6OPNRmPXCopzXw';
    }
]);
