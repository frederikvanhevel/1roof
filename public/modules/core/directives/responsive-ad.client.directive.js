angular.module('core').directive('responsiveAd', [

    function() {
        return {
            restrict: 'A',
            templateUrl: '/modules/core/views/ads/responsive.client.view.html',
            controller: function(){
                (adsbygoogle = window.adsbygoogle || []).push({});
            }
        };
    }
]);
