(function() {
    'use strict';

    angular
        .module('product-data-ui')
        .filter('range', function() {

            return filter;

            function filter(input, min, max) {
                min = parseInt(min);
                max = parseInt(max);
                for( var i = min; i < max+1; i++) {
                    input.push(i);
                }
                return input;
            }
        })


})();