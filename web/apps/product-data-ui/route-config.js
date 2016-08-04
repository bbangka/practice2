(function() {
    'use strict';

    angular
        .module('product-data-ui')
        .config(config);

    /**
     * Angular Application Router
     *
     * @param $locationProvider - angular location provider.
     * @param $routeProvider - angular route provider
     * @constructor
     */


    function config($locationProvider, $routeProvider){

        $locationProvider.html5Mode(true);


        $routeProvider.when('/product-data',
            {
                templateUrl: 'product-data-ui/product-data/product-data'
            }
        );

        $routeProvider.when('/product-search',
            {
                templateUrl: 'product-data-ui/product-data/product-search'
            }
        );


        $routeProvider.otherwise({redirectTo: '/product-data'});

    }



})();