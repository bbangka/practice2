(function() {
    'use strict';


    angular
        .module('product-data-ui')
        .directive('content', content);

    function content(){
        var directive =
        {
            restrict:'E',
            templateUrl:'product-data-ui/product-data/directives/content.template.jade'

        };

        return directive;
    }

})();