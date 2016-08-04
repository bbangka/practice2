(function(){
    'use strict';
    describe('Product Data Controller',function(){

        var createController, $q, $rootScope, merchService, $scope, mediaService, contentService;

        beforeEach(function() {module('product-data-ui') });

        beforeEach(inject(function ($injector) {
            var $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            merchService = $injector.get('merchService');
            mediaService = $injector.get('mediaService');
            contentService = $injector.get('contentService');
            $scope = $injector.get('$rootScope').$new();
            createController = function(){
                return $controller(
                    'ProductDataController',
                    {
                        $scope: $scope,
                        profile: {
                            user: {
                                userId: 'adrinkerwater',
                                groups: ['Park City', 'BackcountryWireless']
                            }
                        }
                    }
                );
            };
        }));


        describe('Exposed variables', function(){
            var controller;
            beforeEach(function() {
                controller = createController();
            });

            it('should have a variable "skuData"', function() {
                expect(controller.skuData).toBeDefined();
                expect(controller.skuData).toEqual({});
            });

            it('should have a variable "show"', function() {
                expect(controller.show).toBeDefined();
                expect(controller.show).toEqual('');
            });

            it('should have a variable "content"', function() {
                expect(controller.content).toBeDefined();
                expect(controller.content).toEqual({});
            });

            it('should have a variable "showVariants"', function() {
                expect(controller.showVariants).toBeDefined();
                expect(controller.showVariants).toEqual('read-only');
            });

            it('should have a variable "selloutCodes"', function() {
                expect(controller.selloutCodes).toBeDefined();
                expect(controller.selloutCodes).toEqual({});
            });

            it('should have a variable "access"', function() {
                expect(controller.access).toBeDefined();
                expect(controller.access).toEqual(false);
            });

            it('should have a variable "images"', function() {
                expect(controller.images).toBeDefined();
                expect(controller.images).toEqual({});
            });
        });

        describe('exposed methods', function () {
            var controller;

            beforeEach(function () {
                controller = createController();
            });


            it('should have a method "getImage"', function () {
                expect(controller.getImage).toBeDefined();
                expect(controller.getImage).toEqual(jasmine.any(Function));
            });

            it('should have a method "changeEditMode"', function () {
                expect(controller.changeEditMode).toBeDefined();
                expect(controller.changeEditMode).toEqual(jasmine.any(Function));
            });

        });

        describe('search',function(){

            var controller, product, productLight, style, content, imagesFromMedia, selloutCodes, seasons, catalogs;

            var mediaDeferred, isSkuLevelDeferred, contentDeferred, merchLightDeferred, merchDeferred, selloutDeferred, seasonDeferred, catalogDeferred;

            var resolveMerchPromise = function (withThis) {
                merchDeferred.resolve(withThis);
                $scope.$apply();
            };

            var resolveMerchLightPromise = function (withThis) {
                merchLightDeferred.resolve(withThis);
                $scope.$apply();
            };

            var resolveMediaPromise = function (withThis) {
                mediaDeferred.resolve(withThis);
                $scope.$apply();
            };

            var resolveIsSkuLevelPromise = function (withThis) {
                isSkuLevelDeferred.resolve(withThis);
                $scope.$apply();
            };

            var resolveContentPromise = function (withThis) {
                contentDeferred.resolve(withThis);
                $scope.$apply();
            };

            var resolveSelloutPromise = function (withThis) {
                selloutDeferred.resolve(withThis);
                $scope.$apply();
            };

            var resolveSeasonPromise = function (withThis) {
                seasonDeferred.resolve(withThis);
                $scope.$apply();
            };

            var resolveCatalogPromise = function (withThis) {
                catalogDeferred.resolve(withThis);
                $scope.$apply();
            };

            beforeEach(function () {
                style="TNF0115";
                imagesFromMedia = {
                    b: {
                        urls: {
                            small: "/abc"
                        },
                        detailImages: []
                    }
                };
                productLight = [{
                    axis1: {swatch : true},
                    axis2: {swatch : false},
                    features: "Weight: 100\r\nPrice: 20\r\nSale Price: 30\r\n",
                    style: style
                }];

                product = [{
                    isSkuLevel: false,
                    axis1: {swatch : true},
                    axis2: {swatch : false},
                    variants: [{
                        sku: "a-b-c",
                        axis1Value: "blue",
                        axis2Value: "S",
                        offers: [{
                            wholesalePrice: 350,
                            salePrice: 350,
                            clearancePrice: 350,
                            price: 350,
                            selloutCodeId: 32
                        }]

                    }],
                    features: "Weight: 100\r\nPrice: 20\r\nSale Price: 30\r\n"
                }];

                content = {
                    PrintContent: {
                        PrintProduct: [{
                            Attribute: [{
                                Label: "Material",
                                ValueArray: [{
                                    Value: [{
                                        TextValue: "a"
                                    },
                                        {
                                            TextValue: "b"
                                        }]
                                }]
                            },
                                {
                                    Label: "Material",
                                    ValueArray: [{
                                        Value: [{
                                            TextValue: "c"
                                        },
                                            {
                                                TextValue: "d"
                                            }]
                                    }]
                                }]
                        }]
                    }
                };

                selloutCodes = {
                    32: "Don't allow backorder",
                    20: "Allow backorder for items on PO"
                };

                seasons = {
                    1: 'SS0',
                    2: 'SS1'
                };

                catalogs = {
                    bcs: 'Backcountry',
                    dogfunk: 'dogfunk'
                };


                merchDeferred = $q.defer();
                mediaDeferred = $q.defer();
                isSkuLevelDeferred = $q.defer();
                contentDeferred = $q.defer();
                merchLightDeferred = $q.defer();
                selloutDeferred = $q.defer();
                seasonDeferred = $q.defer();
                catalogDeferred = $q.defer();

                spyOn(contentService, 'getProduct').andReturn(contentDeferred.promise);

                spyOn(mediaService, 'isSkuLevel').andReturn(isSkuLevelDeferred.promise);
                spyOn(mediaService, 'getImages').andReturn(mediaDeferred.promise);

                spyOn(merchService, 'getProduct').andReturn(merchDeferred.promise);
                spyOn(merchService, 'getProductLight').andReturn(merchLightDeferred.promise);
                spyOn(merchService, 'getSellouts').andReturn(selloutDeferred.promise);
                spyOn(merchService, 'getSeasons').andReturn(seasonDeferred.promise);
                spyOn(merchService, 'getCatalogs').andReturn(catalogDeferred.promise);

                controller = createController();
                resolveSelloutPromise(selloutCodes);
                resolveSeasonPromise(seasons);
                resolveCatalogPromise(catalogs);
                controller.search(style);
            });

            it('should call mediaService.getImages', function(){
                resolveMerchLightPromise(productLight);
                expect(mediaService.getImages).toHaveBeenCalledWith(style);
            });

            it('should call contentService.getProduct', function(){
                resolveMerchLightPromise(productLight);
                resolveIsSkuLevelPromise(false);
                expect(contentService.getProduct).toHaveBeenCalledWith(style);
            });

            it('should call merchService.getProductLight', function(){
                expect(merchService.getProductLight).toHaveBeenCalledWith(style);
            });

            it('should call merchService.getSellouts', function(){
                expect(merchService.getSellouts).toHaveBeenCalled();
            });

            it('should set resolved content on vm.content', function() {
                resolveMerchLightPromise(productLight);
                resolveContentPromise(content);
                expect(controller.content).toBe(content.PrintContent);
            });

            it('should set vm.showVariants to false', function(){
                expect(controller.showVariants).toBe('loading');
            });

            it('should set resolved productLight on skuData', function(){
                resolveMerchLightPromise(productLight);
                resolveIsSkuLevelPromise(false);
                resolveContentPromise([]);

                expect(merchService.getProduct).toHaveBeenCalledWith(style);

                expect(controller.skuData).toBe(productLight[0]);
                expect(controller.show).toEqual('globalSku');
            });

            it('should set resolved imageFromMedia on image', function(){
                resolveMerchLightPromise(productLight);
                resolveMediaPromise(imagesFromMedia);

                expect(controller.getImage('b')).toBe("http://www.backcountry.com/abc");
                expect(controller.getImage('c')).toBe(null);
            });

            it('should set resolved selloutCodes', function(){
                expect(controller.selloutCodes).toEqual(selloutCodes);
            });

            it('should handle empty return', function(){
                productLight = [];
                resolveMerchLightPromise(productLight);
                expect(controller.show).toEqual('error');
            });

            describe('getFullProducts', function() {

                beforeEach(inject(function () {
                    resolveMerchLightPromise(productLight);
                    resolveIsSkuLevelPromise(false);
                }));

                it('should call productDataService.getProduct', function(){
                    expect(merchService.getProduct).toHaveBeenCalledWith(style);
                });

                it('should set resolved product on skuData', function(){
                    resolveMerchPromise(product);

                    expect(controller.skuData).toBe(product[0]);
                    expect(controller.show).toEqual('globalSku');

                });

                it('should set vm.showVariants to true', function(){
                    $rootScope.$broadcast('variantsSorted');
                    resolveMerchPromise(product);
                    expect(controller.showVariants).toBe('read-only');
                });

            });


        });

    });
})();