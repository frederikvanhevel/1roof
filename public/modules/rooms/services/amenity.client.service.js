'use strict';

angular.module('rooms').factory('Amenity', [ 'gettext',
    function(gettext) {
        return {
            list: function() {
                return [{
                    name: gettext('TV'),
                    value: 'television'
                }, {
                    name: gettext('Internet'),
                    value: 'internet'
                }, {
                    name: gettext('Terras'),
                    value: 'terrace'
                }, {
                    name: gettext('Auto garage'),
                    value: 'parking'
                }, {
                    name: gettext('Fietsstalling'),
                    value: 'bicycleParking'
                }, {
                    name: gettext('Dubbel glas'),
                    value: 'doubleGlass'
                }, {
                    name: gettext('Gemeubeld'),
                    value: 'furnished'
                }, {
                    name: gettext('Aparte badkamer'),
                    value: 'seperateBathroom'
                }, {
                    name: gettext('Aparte keuken'),
                    value: 'seperateKitchen'
                }, {
                    name: gettext('Huisdieren toegelaten'),
                    value: 'pets'
                }, {
                    name: gettext('Domicilie verplicht'),
                    value: 'domicile'
                }, {
                    name: gettext('Roken toegelaten'),
                    value: 'smoking'
                }];
            }
        };
    }
]);
