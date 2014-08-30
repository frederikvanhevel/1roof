'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		//$locationProvider.html5Mode(true);

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('pricing', {
			url: '/pricing',
			params: {
				message: { value: null }
			},
			templateUrl: 'modules/core/views/pricing.client.view.html'
		}).
		state('about', {
			url: '/about',
			templateUrl: 'modules/core/views/about.client.view.html'
		});
	}
]);