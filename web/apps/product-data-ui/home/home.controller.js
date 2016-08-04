(function() {
    'use strict';

    angular
        .module('product-data-ui')
        .controller('HomeController', HomeController);

    /**
     * Profile Controller.
     *
     * @param profile - profile service (from fbe.auth).
     */


    function HomeController(profile) {
        var vm = this;

        vm.user = profile.user;


    }


})();
