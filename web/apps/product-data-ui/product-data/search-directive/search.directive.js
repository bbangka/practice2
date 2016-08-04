(function() {
    'use strict';

    angular
        .module('product-data-ui')
        .directive('search', search);

    function search(){
        var directive =
        {
            restrict:'E',
            templateUrl:'product-data-ui/product-data/search-directive/search.template.jade',
            controller: 'SearchController',
            controllerAs: 'id'
        };

        return directive;
    }

})();