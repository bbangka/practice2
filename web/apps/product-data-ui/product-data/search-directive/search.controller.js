(function() {
    'use strict';

    angular
        .module('product-data-ui')
        .controller('SearchController', SearchController);


    function SearchController($location, merchService) {
        var vm = this;

        vm.userInput = "";
        vm.brands = [];
        var brandObject = {};
        vm.brandFilter = "";
        vm.searchClick = searchClick;

        init();

        function init(){
            getBrands();
            vm.userInput = $location.search().search;
        }

        function searchClick(searchText){
            vm.loading = true;
            var brandId = brandObject[vm.brandFilter];
            if(brandId){
                $location.path("/product-search")
                    .search("search", searchText)
                    .search("style", null)
                    .search("brandId", brandId);
            }
            else{
                $location.path("/product-search")
                    .search("search", searchText)
                    .search("style", null)
                    .search("brandId", null);
            }

        }

        function getBrands(){
            merchService.getBrands()
                .then(function(result){
                    brandObject = result;
                    angular.forEach(result, function(id, name){
                        vm.brands.push(name);
                    });
                })

        }
    }

})();