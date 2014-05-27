'use strict';

angular.module('rooms').factory('Amenity', [
	function() {
		return {
			list: function() {
				return [
					{ name: 'Parking', value: 'parking' },
					{ name: 'Double glass', value: 'doubleGlass'}
				];
			}
		};
	}
]);