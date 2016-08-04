(function() {
    'use strict';

    angular
        .module('product-data-ui')
        .directive('editVariants', editVariants);

    function editVariants(){
        var directive =
        {
            restrict:'E',
            templateUrl:'product-data-ui/product-data/edit-directives/edit-variants.template.jade',
        };

        return directive;
    }

})();