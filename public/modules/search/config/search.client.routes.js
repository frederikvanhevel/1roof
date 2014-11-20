'use strict';

//Setting up route
angular.module('search')
    .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            // Search state routing
            $stateProvider.
            state('search', {
                url: '/search/:address',
                templateUrl: '/modules/search/views/search.client.view.html'
            })
            .state('search.overlay', {
                url: '/rooms/:roomId/:isOverlay',
                templateUrl: '/modules/rooms/views/view-room.client.view.html'
            });

            $urlRouterProvider.deferIntercept();
        }
    ])
    .run(['$rootScope', '$urlRouter', 'Device',
        function($rootScope, $urlRouter, Device) {
            $rootScope.$on('$locationChangeSuccess', function(e, newUrl, oldUrl) {
                // Prevent $urlRouter's default handler from firing
                e.preventDefault();

                if (!Device.isMobile() && oldUrl.indexOf('/search/') !== -1 && newUrl.indexOf('/l/') !== -1) {
                    console.log('skipping route');
                } else {
                    $urlRouter.sync();
                }

                // Configures $urlRouter's listener *after* your custom listener
                $urlRouter.listen();
            });
        }
    ]);
