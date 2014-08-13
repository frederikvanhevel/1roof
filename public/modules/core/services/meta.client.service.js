'use strict';

angular.module('core').service('Meta', [ '$rootScope', '$window',
  function($rootScope, $window) {
    
    this.setTitle = function(text, replace) {
        var title = replace ? text : 'Apollo - ' + text;
        //$window.document.title = title;
        $rootScope.title = title;
    };

    this.setDescription = function(text) {
        $rootScope.description = text;
    };

  }
]);