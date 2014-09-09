'use strict';

angular.module('core').directive('dropboxChooser', ['$window',
    function($window) {
        return {
            restrict: 'A',
            scope: {
                chooserSuccess: '&'
            },
            link: function(scope, element, attributes) {

                var options = {
                    success: function(files) {
                        scope.$emit('dropbox_chosen', files);
                    },
                    linkType: 'direct',
                    multiselect: false,
                    extensions: ['images'],
                };

                element.click(function() {
                    $window.Dropbox.choose(options);
                });
            }
        };
    }
]);
