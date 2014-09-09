'use strict';

angular.module('rooms').directive('checkAddress', ['$parse',
    function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attributes, formController) {

                scope.createRoomForm.$setValidity('input', false);

                scope.$watch('autoCompleteDetails', function(newDetails, oldDetails) {
                    if (newDetails) {
                        scope.createRoomForm.$setValidity('input', true);

                        var streetNumber = '';
                        var street = '';
                        var city = '';
                        var country = '';

                        for (var i = 0; i < newDetails.address_components.length; i++) {
                            var type = newDetails.address_components[i].types[0];
                            switch (type) {
                                case 'street_number':
                                    streetNumber = newDetails.address_components[i].long_name;
                                    break;
                                case 'route':
                                    street = newDetails.address_components[i].long_name;
                                    break;
                                case 'locality':
                                    city = newDetails.address_components[i].long_name;
                                    break;
                                case 'country':
                                    country = newDetails.address_components[i].long_name;
                                    break;
                            }
                        }

                        if (street === '') {
                            scope.createRoomForm.$setValidity('noStreet', false);
                        } else {
                            scope.createRoomForm.$setValidity('noStreet', true);
                        }
                        if (streetNumber === '') {
                            scope.createRoomForm.$setValidity('noStreetNumber', false);
                        } else {
                            scope.createRoomForm.$setValidity('noStreetNumber', true);
                        }

                        if (scope.createRoomForm.$valid) {
                            scope.addressDetails = {
                                street: street + ' ' + streetNumber,
                                city: city,
                                country: country,
                                geo: [newDetails.geometry.location.lng(), newDetails.geometry.location.lat()]
                            };
                        }
                    }
                });
            }
        };
    }
]);
