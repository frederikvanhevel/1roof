'use strict';

angular.module('core').service('Meta', ['$rootScope',
    function($rootScope) {

        this.setTitle = function(text, replace) {
            var title = replace ? text : 'Apollo - ' + text;
            $rootScope.title = title;
        };

        this.setDescription = function(text) {
            $rootScope.description = text;
        };

    }
]);
