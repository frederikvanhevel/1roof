'use strict';

angular.module('rooms').directive('owlCarousel', [ '$window',
	function($window) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				scope.$on('pictures_rendered', function( domainElement ) {
					$window.$(element).owlCarousel({
						autoPlay: 5000,
						slideSpeed: 200,
						paginationSpeed: 600,
						rewindSpeed: 800,
						stopOnHover: true,
						navigation: true,
						pagination: true,
						rewindNav: true,
						singleItem: true,
						autoHeight: false,
						lazyLoad : true,
						navigationText: ['<i class="icon-left-open-mini"></i>', '<i class="icon-right-open-mini"></i>']
					});    
		    });
			}
		};
	}
]);