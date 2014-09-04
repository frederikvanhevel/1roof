'use strict';

angular.module('rooms').directive('addressLookup', ['$window', 'Geocoder',
    function($window, Geocoder) {
        return {
            restrict: 'A',
            scope: {
                resultObject: '='
            },
            require: '^form',
            link: function(scope, element, attr, form) {

                form.$setValidity('', false);

                var autocomplete = new $window.google.maps.places.Autocomplete(element[0], {
                    types: ['geocode']
                });
                $window.google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    var place = autocomplete.getPlace();

                    if (place.address_components) getAddressDetails(place);
                    else geocode(place.name);
                });

                function geocode(address) {
                    Geocoder.geocodeAddress(address).then(function(result) {

                        element.val(result.formattedAddress);

                        scope.resultObject = {
                            street: result.street,
                            streetNumber: result.streetNumber,
                            city: result.city,
                            country: result.country,
                            geo: [result.lng, result.lat]
                        };

                        checkValidity();

                    });
                }

                function getAddressDetails(place) {
                    var streetNumber = '';
                    var street = '';
                    var city = '';
                    var country = '';

                    for (var i = 0; i < place.address_components.length; i++) {
                        var type = place.address_components[i].types[0];
                        switch (type) {
                            case 'street_number':
                                streetNumber = place.address_components[i].long_name;
                                break;
                            case 'route':
                                street = place.address_components[i].long_name;
                                break;
                            case 'locality':
                                city = place.address_components[i].long_name;
                                break;
                            case 'country':
                                country = place.address_components[i].long_name;
                                break;
                        }
                    }

                    scope.resultObject = {
                        street: street,
                        streetNumber: streetNumber,
                        city: city,
                        country: country,
                        geo: [place.geometry.location.lng(), place.geometry.location.lat()]
                    };

                    checkValidity();

                }

                function checkValidity() {
                    if (!scope.resultObject.street || scope.resultObject.street === '') {
                        form.$setValidity('noStreet', false);
                    } else {
                        form.$setValidity('noStreet', true);
                    }
                    if (!scope.resultObject.streetNumber || scope.resultObject.streetNumber === '') {
                        form.$setValidity('noStreetNumber', false);
                    } else {
                        form.$setValidity('noStreetNumber', true);
                    }

                }

            }
        };
    }
]);
