'use strict';

angular.module('core').service('ExceptionHandler', ['$exceptionHandler', 'Analytics',
    function($exceptionHandler, Analytics) {

        return function(exception, cause) {
            console.error(exception.stack);
            Analytics.trackException(cause);
        };

    }
]);
