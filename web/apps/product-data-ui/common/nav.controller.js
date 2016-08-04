(function() {
    'use strict';

    angular
        .module('product-data-ui')
        .controller('NavController', NavController);

    /**
     * Nav Controller.
     *
     * @param $window - angular window service.
     * @param logout - logout service (from fbe.auth).
     */
    function NavController($window, logout) {
        var vm = this;
        vm.logoutClick = logoutClick;

        function logoutClick() {
            logout.logout(function(error) {
                $window.location.href = 'login';
            });
        }
    }

})();
