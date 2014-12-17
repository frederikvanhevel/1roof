'use strict';

angular.module('promote').controller('PromoteController', ['$scope','Authentication',
    function($scope, Authentication) {
        $scope.authentication = Authentication;

        $scope.init = function() {
            $scope.htmlReady(); 
        };

    }
]);
