'use strict';

(function() {
    describe('FooterController', function() {
        //Initialize global variables
        var scope,
            FooterController;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();

            FooterController = $controller('FooterController', {
                $scope: scope
            });
        }));

        it('footer should be visible first', function() {
            expect(scope.hidden).toBeFalsy();
        });

        it('should hide footer on hide_footer event', inject(function($rootScope) {
            $rootScope.$broadcast('hide_footer');

            expect(scope.hidden).toBeTruthy();
        }));
    });
})();


