(function() {
    'use strict';


    angular
        .module('product-data-ui')
        .directive('error', error);

    function error(){
        var directive =
        {
            restrict:'E',
            templateUrl:'product-data-ui/product-data/directives/error.template.jade'

        };

        return directive;
    }

})();