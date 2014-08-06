'use strict';

//Setting up route
angular.module('search').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Search state routing
		$stateProvider.
		state('search', {
			url: '/search/:address',
			templateUrl: 'modules/search/views/search.client.view.html'
		})
    .state('search.overlay', {
      url: '/rooms/:roomId/:isOverlay',
      templateUrl: 'modules/rooms/views/view-room.client.view.html'
    });

    console.log($urlRouterProvider);

    $urlRouterProvider.deferIntercept();

	}
])  
.run(['$rootScope', '$urlRouter', '$location', '$state', function ($rootScope, $urlRouter, $location, $state) {
    $rootScope.$on('$locationChangeSuccess', function(e, newUrl, oldUrl) {
      // Prevent $urlRouter's default handler from firing
      e.preventDefault();

      if ($state.current.name.indexOf('search') === -1) {
        $urlRouter.sync();
      }

      // Configures $urlRouter's listener *after* your custom listener
      $urlRouter.listen();
    });
  }
]);