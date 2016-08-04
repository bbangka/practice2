(function() {
    'use strict';

    angular
        .module('product-data-ui')
        .filter('percentage', function($filter) {

            return filter;

            function filter(input, decimals) {
                var decimal = $filter('number')(input, decimals);
                if (decimal)
                    return decimal + '%';
            }
        })
})();