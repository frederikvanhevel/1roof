'use strict';

angular.module('core').directive('shareButton', [
  function() {
    return {
        restriction: 'A',
        link: function(scope, element, attrs) {
            var site = attrs.shareButton;

            console.log(attrs);

            if (site === 'facebook') {
              element.click(function(e) {
                window.open(
                  '//www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href), 
                  'facebook-share-dialog', 
                  'width=626,height=436'
                ); 
                e.preventDefault();
              });
            } else if (site === 'twitter') {
              element.click(function(e) {
                window.open(
                  '//twitter.com/share?url=' + encodeURIComponent(location.href), 
                  'facebook-share-dialog', 
                  'width=626,height=448'
                ); 
                e.preventDefault();
              });
            } else if (site === 'pinterest') {
              element.click(function(e) {
                window.open(
                  '//pinterest.com/pin/create/button/?url=S' + encodeURIComponent(location.href), 
                  'facebook-share-dialog', 
                  'width=626,height=436'
                ); 
                e.preventDefault();
              });
            }  else if (site === 'google') { 
              element.click(function(e) {
                window.open(
                  '//plus.google.com/share?url=' + encodeURIComponent(location.href), 
                  'facebook-share-dialog', 
                  'width=626,height=359'
                ); 
                e.preventDefault();
              });
            }
        }
    };
  }
]);