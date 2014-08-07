'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'apollo';
	var applicationModuleVendorDependencies = [
		'ngResource',
		'ngCookies',
		'ngAnimate',
		'ngTouch',
		'ngSanitize',
		'ui.router',
		'ui.bootstrap',
		'ui.utils',
		'ui-rangeSlider',
		'ngAutocomplete',
		'LocalStorageModule',
		'angularMoment',
		'angularFileUpload',
		'angularMoment',
		'gettext',
		'btford.socket-io'
	];

	// Add a new vertical module
	var registerModule = function(moduleName) {
		// Create angular module
		angular.module(moduleName, []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();