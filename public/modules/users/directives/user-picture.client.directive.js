'use strict';

angular.module('core').directive('userPicture', [

    function() {
        return {
            restriction: 'A',
            scope: {
                userModel: '='
            },
            link: function(scope, element, attrs) {

                var url = '';

                scope.$watch('userModel', function(newVal) {
                    if (newVal) {
                        element.css({
                            'background-image': 'url(' + getUserPicture(newVal) + ')'
                        });
                    }
                });

                function getUserPicture(user) {

                    if (user.provider === 'google')
                        if (user.providerData.image && user.providerData.image.url) return user.providerData.image.url;
                        else return user.providerData.picture || '/modules/core/img/default-user-icon.png';
                    else if (user.provider === 'facebook')
                        return 'https://graph.facebook.com/' + user.providerData.id + '/picture?type=normal';
                    else return '/modules/core/img/default-user-icon.png';

                }

            }
        };
    }
]);
