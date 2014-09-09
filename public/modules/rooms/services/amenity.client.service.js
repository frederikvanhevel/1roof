'use strict';

angular.module('rooms').factory('Amenity', [

    function() {
        return {
            list: function() {
                return [{
                    name: 'TV',
                    value: 'television'
                }, {
                    name: 'Internet',
                    value: 'internet'
                }, {
                    name: 'Terras',
                    value: 'terrace'
                }, {
                    name: 'Auto garage',
                    value: 'parking'
                }, {
                    name: 'Fietsstalling',
                    value: 'bicycleParking'
                }, {
                    name: 'Dubbel glas',
                    value: 'doubleGlass'
                }, {
                    name: 'Bemeubeld',
                    value: 'furnished'
                }, {
                    name: 'Aparte badkamer',
                    value: 'seperateBathroom'
                }, {
                    name: 'Aparte keuken',
                    value: 'seperateKitchen'
                }, {
                    name: 'Huisdieren toegelaten',
                    value: 'pets'
                }, {
                    name: 'Domicilie verplicht',
                    value: 'domicile'
                }];
            }
        };
    }
]);
