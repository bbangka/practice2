(function() {
    'use strict';


    angular
        .module('product-data-ui')
        .directive('cloneTree', cloneTree);

    function cloneTree(){
        var directive =
        {
            restrict:'E',
            templateUrl:'product-data-ui/product-data/directives/clone-tree.template.jade'

        };

        return directive;
    }

})();
