(function() {
    'use strict';

    angular
        .module('product-data-ui')
        .directive('variants', variants);

    function variants(){
        var directive =
        {
            restrict:'E',
            templateUrl:'product-data-ui/product-data/directives/variants.template.jade'
        };

        return directive;
    }

})();