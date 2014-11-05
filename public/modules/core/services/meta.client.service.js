'use strict';

angular.module('core').service('Meta', ['$rootScope',
    function($rootScope) {

        this.setTitle = function(text, replace) {
            var title = replace ? text : '1Roof - ' + text;
            $rootScope.title = title;
        };

        this.setTitlePrefix = function(text) {
            $rootScope.titlePrefix = text + ' ';
        };

        this.setDescription = function(text) {
            $rootScope.description = text;
        };

    }
]);
