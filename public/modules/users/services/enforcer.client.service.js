'use strict';

// Enforce user singup before callback
angular.module('users').service('Enforcer', ['Authentication', 'Modal',
    function(Authentication, Modal) {

        this.do = function(success, failure) {
            if (!Authentication.user) {
                Modal.signup().then(success, failure);
            } else {
                success();
            }
        };

    }
]);
