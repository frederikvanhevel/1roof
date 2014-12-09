'use strict';

// Setting up route
angular.module('core').config(['AnalyticsProvider',
    function(AnalyticsProvider) {
        AnalyticsProvider.setAccount('UA-54653288-1');

        AnalyticsProvider.trackPages(true);

        AnalyticsProvider.useAnalytics(true);

        AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    }
]).run(['Meta',
    function(Meta) {
        Meta.init();
    }
]);
