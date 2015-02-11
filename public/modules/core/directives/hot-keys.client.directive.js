'use strict';

angular.module('core').directive('hotKeys', [ '$document', '$rootScope',
    function($document, $rootScope) {
        return {
            restriction: 'A',
            link: function($scope, element, attrs) {
                $document.bind('keydown', function(e) {
                  $rootScope.$broadcast('keypress', e);
                  $rootScope.$broadcast('keypress:' + e.which, e);
                });

                $scope.$on('$destroy', function() {
                    $document.unbind('keydown');
                });
            }
        };
    }
]);
