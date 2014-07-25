'use strict';

//Setting up route
angular.module('search').config(['$stateProvider',
	function($stateProvider) {
		// Search state routing
		$stateProvider.
		state('search', {
			url: '/search/:address',
			templateUrl: 'modules/search/views/search.client.view.html'
		})
    .state('search.overlay', {
      url: '/rooms/:roomId',
      templateUrl: 'modules/rooms/views/view-room.client.view.html'
    });

	}
]);