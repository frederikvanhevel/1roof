'use strict';

//Setting up route
angular.module('rooms').config(['$stateProvider',
	function($stateProvider) {
		// Rooms state routing
		$stateProvider.
		state('createRoom', {
			url: '/rooms/new',
			templateUrl: 'modules/rooms/views/create-room.client.view.html'
		}).
		state('viewRoom', {
			url: '/rooms/:roomId',
			templateUrl: 'modules/rooms/views/view-room.client.view.html'
		}).
		state('editRoom', {
			url: '/rooms/:roomId/edit/:nav',
			templateUrl: 'modules/rooms/views/edit-room.client.view.html'
		});
	}
]);