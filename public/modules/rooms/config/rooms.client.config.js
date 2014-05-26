'use strict';

// Configuring the Articles module
angular.module('rooms').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Rooms', 'rooms');
		Menus.addMenuItem('topbar', 'New Room', 'rooms/new');
	}
]);