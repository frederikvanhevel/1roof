'use strict';

angular.module('rooms').factory('Amenity', [
	function() {
		return {
			list: function() {
				return [
					{ name: 'TV', value: 'television'},
					{ name: 'Internet', value: 'internet'},
					{ name: 'Terrace', value: 'terrace'},
					{ name: 'Car parking', value: 'parking' },
					{ name: 'Bicycle parking', value: 'bicycleParking'},
					{ name: 'Double glass', value: 'doubleGlass'},
					{ name: 'Furnished', value: 'furnished'},
					{ name: 'Seperate bathroom', value: 'seperateBathroom'},
					{ name: 'Seperate kitchen', value: 'seperateKitchen'},
					{ name: 'Pets allowed', value: 'pets'},
					{ name: 'Domicile compulsory', value: 'domicile' }
				];
			}
		};
	}
]);