'use strict';

// Rooms controller
angular.module('rooms').controller('ModalController', ['$scope', '$modalInstance', 'modalContent',
    function($scope, $modalInstance, modalContent) {
        $scope.modalContent = modalContent;
    }
]);
