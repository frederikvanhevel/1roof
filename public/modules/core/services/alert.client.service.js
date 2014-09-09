'use strict';

angular.module('core').service('Alert', ['$rootScope', '$timeout',
    function($rootScope, $timeout) {
        $rootScope.alerts = [];
        var self = this;

        this.add = function(type, msg, timeout) {
            $rootScope.alerts.push({
                type: type,
                msg: msg,
                close: function() {
                    self.closeAlert(this);
                }
            });

            if (timeout) {
                $timeout(function() {
                    self.closeAlert(this);
                }, timeout);
            }
        };

        this.closeAlert = function(alert) {
            return this.closeAlertIdx($rootScope.alerts.indexOf(alert));
        };

        this.closeAlertIdx = function(index) {
            return $rootScope.alerts.splice(index, 1);
        };

    }
]);
