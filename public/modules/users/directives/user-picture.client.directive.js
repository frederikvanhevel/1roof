'use strict';

angular.module('core').directive('userPicture', [
  function() {
    return {
        restriction: 'A',
        scope: {
          userModel: '='
        },
        link: function(scope, element, attrs ) {

            var url = '';

            scope.$watch('userModel', function(newVal) {
                if (newVal) {
                    element.css({
                        'background-image': 'url(' + getUserPicture(newVal) +')'
                    });
                }
            });

            function getUserPicture(user) {
                
                if (user.provider === 'google')
                    return user.providerData.picture;
                else if (user.provider === 'facebook')
                    return 'http://graph.facebook.com/' + user.providerData.id + '/picture?type=normal';
                else return '/modules/core/img/default-user-icon.png';

            }

        }
    };
  }
]);