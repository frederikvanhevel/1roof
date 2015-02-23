'use strict';

/**
 * Service that gives us a nice Angular-esque wrapper around the
 * stackTrace.js pintStackTrace() method.
 */
angular.module('core').factory('traceService',
    function() {
        return({
            print: printStackTrace
        });
    }
);

/**
 * Override Angular's built in exception handler, and tell it to
 * use our new exceptionLoggingService which is defined below
 */
angular.module('core').provider('$exceptionHandler',{
        $get: function(exceptionLoggingService){
            return(exceptionLoggingService);
        }
    }
);

/**
 * Exception Logging Service, currently only used by the $exceptionHandler
 * it preserves the default behaviour ( logging to the console) but
 * also posts the error server side after generating a stacktrace.
 */
angular.module('core').factory('exceptionLoggingService', ['$log','$window', 'traceService',
    function($log, $window, traceService){
        function error(exception, cause){

            // preserve the default behaviour which will log the error
            // to the console, and allow the application to continue running.
            $log.error.apply($log, arguments);

            // now try to log the error to the server side.
            try{
                var errorMessage = exception.toString();

                // use our traceService to generate a stack trace
                var stackTrace = traceService.print({e: exception});

                // use AJAX (in this example jQuery) and NOT
                // an angular service such as $http
                $window.$.ajax({
                    type: 'POST',
                    url: '/api/logger',
                    contentType: 'application/json',
                    data: angular.toJson({
                        url: $window.location.href,
                        message: errorMessage,
                        type: 'exception',
                        stackTrace: stackTrace,
                        cause: ( cause || ''),
                        agent: navigator.userAgent
                    })
                });
            } catch (loggingError){
                $log.warn('Error server-side logging failed');
                $log.log(loggingError);
            }
        }
        return(error);
    }]
);
