'use strict';

angular.module('core').factory('Socket', ['$window', 'socketFactory',
    function($window, socketFactory) {

        return socketFactory();

    }
]);
