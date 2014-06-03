'use strict';

angular.module('core').directive('onRepeatDone', [
	function() {
		return {
        restriction: 'A',
        link: function($scope, element, attributes ) {
            $scope.$emit(attributes.onRepeatDone || 'repeat_done', element);
        }
    }
	}
]);