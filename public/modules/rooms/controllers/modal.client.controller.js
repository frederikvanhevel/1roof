'use strict';

// Rooms controller
angular.module('rooms').controller('ModalController', ['$rootScope', '$scope', '$modalInstance', 'modalContent',
    function($rootScope, $scope, $modalInstance, modalContent) {
        $scope.modalContent = modalContent;
    }
]);
