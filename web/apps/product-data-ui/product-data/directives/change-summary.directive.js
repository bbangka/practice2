(function() {
    'use strict';

    angular
        .module('product-data-ui')
        .directive('changeSummary', changeSummary);

    function changeSummary(){
        var directive =
        {
            restrict:'E',
            templateUrl:'product-data-ui/product-data/directives/change-summary.template.jade'
        };

        return directive;
    }

})();