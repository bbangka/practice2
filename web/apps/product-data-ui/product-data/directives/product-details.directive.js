
(function() {
    'use strict';


    angular
        .module('product-data-ui')
        .directive('productDetails', productDetails);

    function productDetails(){
        var directive =
        {
            restrict:'E',
            templateUrl:'product-data-ui/product-data/directives/product-details.template.jade'

        };

        return directive;
    }

})();