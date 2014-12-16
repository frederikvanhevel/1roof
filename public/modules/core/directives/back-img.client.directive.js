'use strict';

angular.module('core').directive('backImg', [

    function() {
        return {
            restriction: 'A',
            scope: {
                imgProvider: '@',
                imgLink: '@',
                isImgTag: '@'
            },
            link: function(scope, element, attrs) {

                var url = '';

                if (!scope.imgProvider || !scope.imgLink) return;

                if (scope.imgProvider === 'cloudinary')
                    url = 'https://res.cloudinary.com/dv8yfamzc/image/upload/' + scope.imgLink + '.png';
                else url = scope.imgLink;

                if (scope.isImgTag) {
                    element.attr('src', url);
                } else {
                    element.css({
                        'background-image': 'url(' + url + ')'
                    });
                }

            }
        };
    }
]);
