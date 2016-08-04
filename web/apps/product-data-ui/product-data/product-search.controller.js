(function() {
    'use strict';

    angular
        .module('product-data-ui')
        .controller('ProductSearchController', ProductSearchController);


    function ProductSearchController(searchService, $location, $routeParams) {
        var vm = this;

        vm.searchResults;
        vm.loading;

        vm.productClick = productClick;
        vm.search = search;

        init();

        function init(){
            if($routeParams.search){
                search($routeParams.search, $routeParams.brandId);
            }
        }

        function search(searchText, brandId){
            vm.loading = true;
            vm.searchResults = null;
            searchService.search(searchText, brandId)
                .then(function(searchResults){
                    vm.searchResults = searchResults;
                    vm.loading = false;
                    if(vm.searchResults.length == 1){
                        $location.replace();
                        productClick(searchResults[0].style);
                    }
                })
        }

        function productClick(style){
            $location
                .path("/product-data")
                .search("style", style)
                .search("search", null)
                .search("brandId", null);
        }


    }

})();