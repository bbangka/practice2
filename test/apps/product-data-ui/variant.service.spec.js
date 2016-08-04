(function(){
    'use strict';
    describe('VariantService', function () {

        var variantService;
        var product, sorted, qohs, vendorSkus, sizing;
        var $q, $scope;

        beforeEach(function () {
            module('product-data-ui')
        });
        beforeEach(inject(function ($injector) {
            variantService = $injector.get('variantService');
            $q = $injector.get('$q');
            $scope = $injector.get('$rootScope').$new();
        }));

        beforeEach(function () {
            qohs = {
                "a-a-1": 1,
                "a-b-1": 1,
                "a-a-2": 2,
                "a-c-3": 3
            };

            vendorSkus = {
                "a-a-1": "aa1",
                "a-b-1": "ab1",
                "a-a-2": "aa2",
                "a-c-3": "ac3"
            };

            sizing = {
                "a-a-1": 1,
                "a-b-1": 1,
                "a-a-2": 2,
                "a-c-3": 3
            };

            product = {
                isSkuLevel: false,
                axis1: {swatch : true},
                axis2: {swatch : false},
                variants: [
                    {
                        sku: "a-a-1",
                        axis1Value: "blue",
                        axis2Value: "M",
                        offers: [{
                            wholesalePrice: 350,
                            salePrice: 350,
                            clearancePrice: 350,
                            price: 350,
                            selloutCodeId: 32
                        }],
                        season: "FW0",
                        year: 2015

                    },
                    {

                        sku: "a-b-1",
                        axis1Value: "red",
                        axis2Value: "M",
                        offers: [{
                            wholesalePrice: 350,
                            salePrice: 350,
                            clearancePrice: 350,
                            price: 350,
                            selloutCodeId: 32
                        }],
                        season: "SS0",
                        year: 2016
                    },
                    {
                        sku: "a-a-2",
                        axis1Value: "blue",
                        axis2Value: "S",
                        offers: [{
                            wholesalePrice: 200,
                            salePrice: 200,
                            clearancePrice: 200,
                            price: 200,
                            selloutCodeId: 16
                        }],
                        season: "SS0",
                        year: 2017

                    },
                    {
                        sku: "a-c-3",
                        axis1Value: "green",
                        axis2Value: "XL",
                        offers: [{
                            wholesalePrice: 125,
                            salePrice: 100,
                            clearancePrice: 200,
                            price: 120,
                            selloutCodeId: 32
                        }],
                        season: "FW0",
                        catalogAssignments: ['bcs','ags'],
                        year: 2012
                    }]
            };

        });

        describe('swatched on axis1', function() {

            beforeEach(function () {


                sorted = [
                    {
                        identifier: "a",
                        swatch: 'blue',
                        qoh: 3,
                        variants: [
                            {
                                sku: "a-a-1",
                                axis1Value: "blue",
                                axis2Value: "M",
                                offers: [{
                                    wholesalePrice: 350,
                                    salePrice: 350,
                                    clearancePrice: 350,
                                    price: 350,
                                    selloutCodeId: 32
                                }],
                                season: "FW0",
                                year: 2015,
                                qoh: 1,
                                vendorSku: "aa1",
                                sizing: 1,
                                yearModel: 2015,
                                catalogModel: [],
                                seasonModel: "FW0",
                                selloutModel: 32,
                                wholesaleModel: 350,
                                saleModel: 350,
                                clearanceModel: 350,
                                regularModel: 350,
                                gruppoModel: undefined,
                                flashModel: undefined

                            },
                            {
                                sku: "a-a-2",
                                axis1Value: "blue",
                                axis2Value: "S",
                                offers: [{
                                    wholesalePrice: 200,
                                    salePrice: 200,
                                    clearancePrice: 200,
                                    price: 200,
                                    selloutCodeId: 16
                                }],
                                season: "SS0",
                                year: 2017,
                                qoh: 2,
                                vendorSku: "aa2",
                                sizing: 2,
                                yearModel: 2017,
                                catalogModel: [],
                                seasonModel: "SS0",
                                selloutModel: 16,
                                wholesaleModel: 200,
                                saleModel: 200,
                                clearanceModel: 200,
                                regularModel: 200,
                                gruppoModel: undefined,
                                flashModel: undefined
                            }

                        ],
                        isOpen: false,
                        minPrice: 200,
                        maxPrice: 350,
                        minWSPrice: 200,
                        maxWSPrice: 350,
                        minSPrice: 200,
                        maxSPrice: 350,
                        minCPrice: 200,
                        maxCPrice: 350,
                        seasons: ["FW0 - 2015", "SS0 - 2017"],
                        catalogs: [],
                        soCode: [32, 16],
                        mostRecentSeason: 20170
                    },
                    {
                        identifier: "b",
                        qoh: 1,
                        swatch: 'red',
                        variants: [
                            {   sku: "a-b-1",
                                axis1Value: "red",
                                axis2Value: "M",
                                offers: [{
                                    wholesalePrice: 350,
                                    salePrice: 350,
                                    clearancePrice: 350,
                                    price: 350,
                                    selloutCodeId: 32
                                }],
                                season: "SS0",
                                year: 2016,
                                qoh: 1,
                                vendorSku: "ab1",
                                sizing: 1,
                                yearModel: 2016,
                                catalogModel: [],
                                seasonModel: "SS0",
                                selloutModel: 32,
                                wholesaleModel: 350,
                                saleModel: 350,
                                clearanceModel: 350,
                                regularModel: 350,
                                gruppoModel: undefined,
                                flashModel: undefined
                            }
                        ],
                        isOpen: false,
                        minPrice: 350,
                        maxPrice: 350,
                        minWSPrice: 350,
                        maxWSPrice: 350,
                        minSPrice: 350,
                        maxSPrice: 350,
                        minCPrice: 350,
                        maxCPrice: 350,
                        seasons: ["SS0 - 2016"],
                        catalogs: [],
                        soCode: [32],
                        mostRecentSeason:20160
                    },
                    {
                        identifier: "c",
                        qoh: 3,
                        swatch: 'green',
                        variants: [
                            {
                                sku: "a-c-3",
                                axis1Value: "green",
                                axis2Value: "XL",
                                offers: [{
                                    wholesalePrice: 125,
                                    salePrice: 100,
                                    clearancePrice: 200,
                                    price: 120,
                                    selloutCodeId: 32
                                }],
                                season: "FW0",
                                year: 2012,
                                qoh: 3,
                                vendorSku: "ac3",
                                sizing: 3,
                                yearModel: 2012,
                                catalogModel: ['bcs','ags'],
                                seasonModel: "FW0",
                                selloutModel: 32,
                                wholesaleModel: 125,
                                saleModel: 100,
                                clearanceModel: 200,
                                regularModel: 120,
                                gruppoModel: undefined,
                                flashModel: undefined,
                                catalogAssignments: ['bcs','ags']
                            }
                        ],
                        isOpen: false,
                        minPrice: 120,
                        maxPrice: 120,
                        minWSPrice: 125,
                        maxWSPrice: 125,
                        minSPrice: 100,
                        maxSPrice: 100,
                        minCPrice: 200,
                        maxCPrice: 200,
                        seasons: ["FW0 - 2012"],
                        catalogs: ['bcs','ags'],
                        soCode: [32],
                        mostRecentSeason: 20123
                    }
                ];
            });

            it('should sort on axis1 correctly', function(){
                expect(variantService.sortVariants(product, qohs, vendorSkus, sizing)).toEqual(sorted);
            });

        });

        describe('swatched on axis2', function() {

            beforeEach(function () {
                product.axis1.swatch = false;
                product.axis2.swatch = true;

                sorted = [
                     {
                        identifier: "1",
                        qoh: 2,
                        swatch: 'M',
                        variants: [
                            {
                                sku: "a-a-1",
                                axis1Value: "blue",
                                axis2Value: "M",
                                offers: [{
                                    wholesalePrice: 350,
                                    salePrice: 350,
                                    clearancePrice: 350,
                                    price: 350,
                                    selloutCodeId: 32
                                }],
                                season: "FW0",
                                year: 2015,
                                qoh: 1,
                                vendorSku: "aa1",
                                sizing: 1,
                                yearModel: 2015,
                                catalogModel: [],
                                seasonModel: "FW0",
                                selloutModel: 32,
                                wholesaleModel: 350,
                                saleModel: 350,
                                clearanceModel: 350,
                                regularModel: 350,
                                gruppoModel: undefined,
                                flashModel: undefined

                            },
                            {

                                sku: "a-b-1",
                                axis1Value: "red",
                                axis2Value: "M",
                                offers: [{
                                    wholesalePrice: 350,
                                    salePrice: 350,
                                    clearancePrice: 350,
                                    price: 350,
                                    selloutCodeId: 32
                                }],
                                season: "SS0",
                                year: 2016,
                                qoh: 1,
                                vendorSku: "ab1",
                                sizing: 1,
                                yearModel: 2016,
                                catalogModel: [],
                                seasonModel: "SS0",
                                selloutModel: 32,
                                wholesaleModel: 350,
                                saleModel: 350,
                                clearanceModel: 350,
                                regularModel: 350,
                                gruppoModel: undefined,
                                flashModel: undefined
                            }

                        ],
                        isOpen: false,
                        minPrice: 350,
                        maxPrice: 350,
                        minWSPrice: 350,
                        maxWSPrice: 350,
                        minSPrice: 350,
                        maxSPrice: 350,
                        minCPrice: 350,
                        maxCPrice: 350,
                        seasons: ["FW0 - 2015", "SS0 - 2016"],
                        catalogs: [],
                        soCode: [32],
                        mostRecentSeason:20160
                    },
                     {
                        identifier: "2",
                        qoh: 2,
                        swatch: 'S',
                        variants: [
                            {
                                sku: "a-a-2",
                                axis1Value: "blue",
                                axis2Value: "S",
                                offers: [{
                                    wholesalePrice: 200,
                                    salePrice: 200,
                                    clearancePrice: 200,
                                    price: 200,
                                    selloutCodeId: 16
                                }],
                                season: "SS0",
                                year: 2017,
                                qoh: 2,
                                vendorSku: "aa2",
                                sizing: 2,
                                yearModel: 2017,
                                catalogModel: [],
                                seasonModel: "SS0",
                                selloutModel: 16,
                                wholesaleModel: 200,
                                saleModel: 200,
                                clearanceModel: 200,
                                regularModel: 200,
                                gruppoModel: undefined,
                                flashModel: undefined
                            }
                        ],
                        isOpen: false,
                        minPrice: 200,
                        maxPrice: 200,
                        minWSPrice: 200,
                        maxWSPrice: 200,
                        minSPrice: 200,
                        maxSPrice: 200,
                        minCPrice: 200,
                        maxCPrice: 200,
                        seasons: ["SS0 - 2017"],
                        catalogs: [],
                        soCode: [16],
                        mostRecentSeason: 20170
                    },
                     {
                        identifier: "3",
                        qoh: 3,
                        swatch: 'XL',
                        variants: [
                            {
                                sku: "a-c-3",
                                axis1Value: "green",
                                axis2Value: "XL",
                                offers: [{
                                    wholesalePrice: 125,
                                    salePrice: 100,
                                    clearancePrice: 200,
                                    price: 120,
                                    selloutCodeId: 32
                                }],
                                season: "FW0",
                                year: 2012,
                                qoh: 3,
                                vendorSku: "ac3",
                                sizing: 3,
                                yearModel: 2012,
                                catalogModel: ['bcs','ags'],
                                seasonModel: "FW0",
                                selloutModel: 32,
                                wholesaleModel: 125,
                                saleModel: 100,
                                clearanceModel: 200,
                                regularModel: 120,
                                gruppoModel: undefined,
                                flashModel: undefined,
                                catalogAssignments: ['bcs','ags']
                            }
                        ],
                        isOpen: false,
                        minPrice: 120,
                        maxPrice: 120,
                        minWSPrice: 125,
                        maxWSPrice: 125,
                        minSPrice: 100,
                        maxSPrice: 100,
                        minCPrice: 200,
                        maxCPrice: 200,
                        seasons: ["FW0 - 2012"],
                        catalogs: ['bcs', 'ags'],
                        soCode: [32],
                        mostRecentSeason:20123
                    }
                ];
            });

            it('should sort on axis1 correctly', function(){
                expect(variantService.sortVariants(product, qohs, vendorSkus, sizing)).toEqual(sorted);
            });

        });

        describe('swatched on both axis\'', function() {

            beforeEach(function () {
                product.isSkuLevel = true;

                sorted = [
                    {
                        identifier: "a-a-1",
                        qoh: 1,
                        swatch: 'a-a-1',
                        variants: [
                            {
                                sku: "a-a-1",
                                axis1Value: "blue",
                                axis2Value: "M",
                                offers: [{
                                    wholesalePrice: 350,
                                    salePrice: 350,
                                    clearancePrice: 350,
                                    price: 350,
                                    selloutCodeId: 32
                                }],
                                season: "FW0",
                                year: 2015,
                                qoh: 1,
                                vendorSku: "aa1",
                                sizing: 1,
                                yearModel: 2015,
                                catalogModel: [],
                                seasonModel: "FW0",
                                selloutModel: 32,
                                wholesaleModel: 350,
                                saleModel: 350,
                                clearanceModel: 350,
                                regularModel: 350,
                                gruppoModel: undefined,
                                flashModel: undefined

                            }

                        ],
                        isOpen: false,
                        minPrice: 350,
                        maxPrice: 350,
                        minWSPrice: 350,
                        maxWSPrice: 350,
                        minSPrice: 350,
                        maxSPrice: 350,
                        minCPrice: 350,
                        maxCPrice: 350,
                        seasons: ["FW0 - 2015"],
                        soCode: [32],
                        catalogs: [],
                        mostRecentSeason: 20153
                    },
                    {
                        identifier: "a-b-1",
                        qoh: 1,
                        swatch: 'a-b-1',
                        variants: [
                            {
                                sku: "a-b-1",
                                axis1Value: "red",
                                axis2Value: "M",
                                offers: [{
                                    wholesalePrice: 350,
                                    salePrice: 350,
                                    clearancePrice: 350,
                                    price: 350,
                                    selloutCodeId: 32
                                }],
                                season: "SS0",
                                year: 2016,
                                qoh: 1,
                                vendorSku: "ab1",
                                sizing: 1,
                                yearModel: 2016,
                                catalogModel: [],
                                seasonModel: "SS0",
                                selloutModel: 32,
                                wholesaleModel: 350,
                                saleModel: 350,
                                clearanceModel: 350,
                                regularModel: 350,
                                gruppoModel: undefined,
                                flashModel: undefined
                            }
                        ],
                        isOpen: false,
                        minPrice: 350,
                        maxPrice: 350,
                        minWSPrice: 350,
                        maxWSPrice: 350,
                        minSPrice: 350,
                        maxSPrice: 350,
                        minCPrice: 350,
                        maxCPrice: 350,
                        seasons: ["SS0 - 2016"],
                        catalogs: [],
                        soCode: [32],
                        mostRecentSeason:20160
                    },
                    {
                        identifier: "a-a-2",
                        qoh: 2,
                        swatch: 'a-a-2',
                        variants: [
                            {
                                sku: "a-a-2",
                                axis1Value: "blue",
                                axis2Value: "S",
                                offers: [{
                                    wholesalePrice: 200,
                                    salePrice: 200,
                                    clearancePrice: 200,
                                    price: 200,
                                    selloutCodeId: 16
                                }],
                                season: "SS0",
                                year: 2017,
                                qoh: 2,
                                vendorSku: "aa2",
                                sizing: 2,
                                yearModel: 2017,
                                catalogModel: [],
                                seasonModel: "SS0",
                                selloutModel: 16,
                                wholesaleModel: 200,
                                saleModel: 200,
                                clearanceModel: 200,
                                regularModel: 200,
                                gruppoModel: undefined,
                                flashModel: undefined
                            }
                        ],
                        isOpen: false,
                        minPrice: 200,
                        maxPrice: 200,
                        minWSPrice: 200,
                        maxWSPrice: 200,
                        minSPrice: 200,
                        maxSPrice: 200,
                        minCPrice: 200,
                        maxCPrice: 200,
                        seasons: ["SS0 - 2017"],
                        soCode: [16],
                        catalogs: [],
                        mostRecentSeason: 20170
                    },
                    {
                        identifier: "a-c-3",
                        qoh: 3,
                        swatch: 'a-c-3',
                        variants: [
                            {
                                sku: "a-c-3",
                                axis1Value: "green",
                                axis2Value: "XL",
                                offers: [{
                                    wholesalePrice: 125,
                                    salePrice: 100,
                                    clearancePrice: 200,
                                    price: 120,
                                    selloutCodeId: 32
                                }],
                                season: "FW0",
                                year: 2012,
                                qoh: 3,
                                vendorSku: "ac3",
                                sizing: 3,
                                yearModel: 2012,
                                catalogModel: ['bcs','ags'],
                                seasonModel: "FW0",
                                selloutModel: 32,
                                wholesaleModel: 125,
                                saleModel: 100,
                                clearanceModel: 200,
                                regularModel: 120,
                                gruppoModel: undefined,
                                flashModel: undefined,
                                catalogAssignments: ['bcs','ags']

                            }
                        ],
                        isOpen: false,
                        minPrice: 120,
                        maxPrice: 120,
                        minWSPrice: 125,
                        maxWSPrice: 125,
                        minSPrice: 100,
                        maxSPrice: 100,
                        minCPrice: 200,
                        maxCPrice: 200,
                        seasons: ["FW0 - 2012"],
                        catalogs: ['bcs','ags'],
                        soCode: [32],
                        mostRecentSeason:20123
                    }
                ];
            });

            it('should sort on sku level correctly', function(){
                expect(variantService.sortVariants(product, qohs, vendorSkus, sizing)).toEqual(sorted);
            });

        });

        describe('should convert string to number', function(){

            it('should have a method convertToNumber', function(){
                expect(variantService.convertToNumber).toBeDefined();
            });

            it('should convert string to number', function(){
                var stringToConvert = "SS2 - 2015";
                var result = 20152;
                expect(variantService.convertToNumber(stringToConvert)).toEqual(result);
            });

        });

        describe('should validate field change', function(){

            var validationDeferred;

            var resolveValidationPromise = function (withThis) {
                validationDeferred.resolve(withThis);
                $scope.$apply();
            };

            beforeEach(function(){
                validationDeferred = $q.defer();
                validationDeferred.$promise = validationDeferred.promise;
                spyOn(variantService.matValidationResource, 'save').andReturn(validationDeferred);
            });

            it('should have a method validateFieldChange', function(){
                expect(variantService.validateFieldChange).toBeDefined();
            });

            it('should validate price change', function(){
                var skuActions = [{
                    sku : "TNF0115-DORB-M",
                    newValues : {
                        salePrice: 120
                    }
                }];

                variantService.validateFieldChange(skuActions);
                resolveValidationPromise({});

                expect(variantService.matValidationResource.save).toHaveBeenCalledWith({}, skuActions);
            });

        });

        describe('should save price change', function(){

            var saveDeferred;

            var resolveSavePromise = function (withThis) {
                saveDeferred.resolve(withThis);
                $scope.$apply();
            };

            beforeEach(function(){
                saveDeferred = $q.defer();
                saveDeferred.$promise = saveDeferred.promise;
                spyOn(variantService.matSaveResource, 'save').andReturn(saveDeferred);
            });

            it('should have a method savePriceChange', function(){
                expect(variantService.savePriceChange).toBeDefined();
            });

            it('should validate price change', function(){
                var merchAction = {

                };

                variantService.savePriceChange(merchAction);
                resolveSavePromise({});

                expect(variantService.matSaveResource.save).toHaveBeenCalledWith({}, merchAction);
            });

        });

    });

})();
