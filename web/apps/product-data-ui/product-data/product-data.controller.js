(function() {
    'use strict';

    angular
        .module('product-data-ui')
        .controller('ProductDataController', ProductDataController);


    function ProductDataController($routeParams, $scope, profile, merchService, mediaService, contentService) {
        var vm = this;
        var approvedGroups = ['Merchandising', 'merchtoolaccess'];

        vm.search = search;
        vm.getImage = getSingleImage;
        vm.changeEditMode=changeEditMode;
        
        vm.images = {};
        vm.access = isAuthorized();
        vm.year = new Date().getFullYear();
        vm.skuData={};
        vm.show = '';
        vm.content = {};
        vm.showVariants = 'read-only';
        vm.selloutCodes = {};
        vm.seasons = {};
        vm.catalogs = {};

        getSelloutCodes();
        getSeasons();
        getCatalogs();

        $scope.$on('variantsSorted', function(event){
            vm.showVariants = 'read-only';
        });

        init();


        function init(){
            if($routeParams.style){
                search($routeParams.style)
            }
        }


        function isAuthorized(){
            var access = false;

            angular.forEach(profile.user.groups, function(group){
                if (approvedGroups.indexOf(group) !== -1)
                    access = true;
            });

            return access;
        }

        function getSelloutCodes(){
            merchService.getSellouts()
                .then(function(result){
                    vm.selloutCodes = result;
                })

        }

        function getSeasons(){
            merchService.getSeasons()
                .then(function(result){
                    vm.seasons = result;
                })

        }

        function getCatalogs(){
            merchService.getCatalogs()
                .then(function(result){
                    vm.catalogs = result;
                })
        }

        function search(style) {
            clear();
            getProduct(style);
        }

        function clear() {
            vm.skuData = {};
            vm.content = {};
            vm.showVariants = 'loading';
        }

        function changeEditMode(){
            if(vm.showVariants==='edit')
                vm.showVariants='read-only';
            else if(vm.showVariants==='read-only')
                vm.showVariants='edit';
        }

        function getProduct(style) {
            merchService.getProductLight(style)
                .then(function(product){
                    if (product.length === 1) {
                        vm.skuData = product[0];
                        vm.show = 'globalSku';
                        $scope.$broadcast('getVenderSku', vm.skuData.style);
                        mediaService.isSkuLevel(vm.skuData.style)
                            .then(function(isSkuLevel){
                                getFullProduct(vm.skuData.style, isSkuLevel);
                            });
                        getImages(vm.skuData.style);
                        getContent(vm.skuData.style);
                    }
                    else {
                        vm.skuData = product;
                        vm.show = 'error';
                    }
                });
        }

        function getFullProduct(style, isSkuLevel) {
            merchService.getProduct(style)
                .then(function(product){
                    vm.skuData = product[0];
                    vm.skuData.isSkuLevel = isSkuLevel;
                    $scope.$broadcast('sortVariants', vm.skuData, style);
                }, function(error) {
                    vm.show = 'error';
                });
        }

        function getContent(style) {
            contentService.getProduct(style)
                .then(function(product) {
                    vm.content = product.PrintContent;
                }, function(error) {
                    vm.content = {};
                });
        }

        function getImages(style){
            mediaService.getImages(style)
                .then(function(data) {
                    vm.images = data;
                }, function(error){
                    vm.images = {};
                });
        }

        function getSingleImage(identifier) {
            var key = null;
            if (vm.images[identifier])
                key = vm.images[identifier].urls.small;
            if(key) {
                return "http://www.backcountry.com"+key;
            }
            return null;

        }

    }

})();