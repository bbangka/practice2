(function(){
    angular
        .module("product-data-ui")
        .factory("merchService", merchService);


        function merchService($resource, $q) {
            var service = {
                searchResource: $resource('search'),
                merchResource: $resource('merchv3/products'),
                vendorResource: $resource('merchv3/vendor-skus'),
                sellOutResource: $resource('merchv3/selloutCodes'),
                seasonsResource: $resource('merchv3/seasons'),
                catalogResource: $resource('merchv3/catalogs'),
                brandResource: $resource('merchv3/brands'),
                getProduct: getProduct,
                getProductLight: getProductLight,
                getVendorSku: getVendorSku,
                getSellouts: getSellouts,
                getSeasons: getSeasons,
                getCatalogs: getCatalogs,
                getBrands: getBrands,
            };

            return service;

            var selloutCache;
            var seasonsCache;
            var catalogsCache;
            var brandsCache;

            function getProduct(style) {
                return service.merchResource.query({styles: style}).$promise;
            }

            function getProductLight(style) {
                return service.searchResource.query({search: style}).$promise;
            }

            function getVendorSku(style) {
                var deferred = $q.defer();
                service.vendorResource.query({style: style}).$promise
                    .then(function(result){
                        var vendorObj = getVendorObject(result);
                        deferred.resolve(vendorObj);
                    });

                return deferred.promise;
            }

            function getVendorObject(vendorArray) {
                var vendorObj= {};

                for (var i = 0; i < vendorArray.length; i++) {
                    vendorObj[vendorArray[i].sku] = vendorArray[i].vendorSku;
                }
                return vendorObj;
            }

            function getSellouts(){
                var deferred = $q.defer();
                if(!selloutCache) {
                    service.sellOutResource.query().$promise
                        .then(function (result) {
                            var sellOutObj = getSelloutObject(result);
                            deferred.resolve(sellOutObj);
                            selloutCache = sellOutObj;
                        }, function (error) {
                            var errorObj = {
                                0: "Allow backorder",
                                32: "Don't allow backorder",
                                34: "Don't allow backorder - flash sale",
                                20: "Allow backorder for items on PO"
                            };
                            deferred.resolve(errorObj);
                        });
                }
                else{
                    deferred.resolve(selloutCache);
                }
                return deferred.promise;
            }

            function getSelloutObject(selloutArray){
                var sellOutObj={};
                angular.forEach(selloutArray,function(sellOut){
                    if(sellOut.selloutCode == "") {
                        sellOutObj[0] = sellOut.title;
                    }
                    else {
                        sellOutObj[sellOut.selloutCode] = sellOut.title;
                    }
                });
                return sellOutObj;
            }

            function getSeasons(){

                var deferred = $q.defer();
                if(!seasonsCache) {
                    service.seasonsResource.query().$promise
                        .then(function (result) {
                            var seasonObj = getSeasonObject(result);
                            deferred.resolve(seasonObj);
                            seasonsCache = seasonObj;
                        }, function (error) {
                            var errorObj = {
                                1: "SS0",
                                2: "SS1",
                                3: "SS2",
                                4: "FW0",
                                5: "FW1",
                                6: "FW2",
                                7: "COR"
                            };

                            deferred.resolve(errorObj);
                        });
                }
                else{
                    deferred.resolve(seasonsCache);
                }
                return deferred.promise;
            }

            function getSeasonObject(seasonsArray){
                var seasonObj={};
                angular.forEach(seasonsArray,function(season){
                    seasonObj[season.sort] = season.season;
                });
                return seasonObj;
            }

            function getCatalogs(){

                var deferred = $q.defer();
                if(!catalogsCache) {
                    service.catalogResource.query().$promise
                        .then(function (result) {
                            var catalogObj = getCatalogObject(result);
                            deferred.resolve(catalogObj);
                            catalogsCache = catalogObj;
                        }, function (error) {
                            var errorObj = {
                                bcs: "Backcountry",
                                chainlove: "Chainlove",
                                competitivecyclist: "Competitive Cyclist",
                                dogfunk: "Dogfunk",
                                motosport: "MotoSport",
                                steepcheap: "SteepandCheap",
                                wm: "WhiskeyMilitia"
                            };

                            deferred.resolve(errorObj);
                        });
                }
                else{
                    deferred.resolve(catalogsCache);
                }

                return deferred.promise;
            }

            function getCatalogObject(catalogArray){
                var catalogObj={};
                angular.forEach(catalogArray,function(catalog){
                    catalogObj[catalog.id] = catalog.name;
                });
                return catalogObj;
            }

            function getBrands(){

                var deferred = $q.defer();
                if(!brandsCache) {
                    service.brandResource.query().$promise
                        .then(function (result) {
                            var brandObj = getBrandLight(result);
                            deferred.resolve(brandObj);
                            brandsCache = brandObj;
                        }, function (error) {
                            var errorObj = {
                                "Server Problem": 404
                            };

                            deferred.resolve(errorObj);
                        });
                }
                else{
                    deferred.resolve(brandsCache);
                }

                return deferred.promise;
            }

            function getBrandLight(brandArray){
                var brandLight={};
                angular.forEach(brandArray,function(brand){
                    brandLight[brand.name] = brand.brandId;
                });
                return brandLight;
            }
        }
})();