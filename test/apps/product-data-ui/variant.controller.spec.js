(function(){
    'use strict';
    describe('Variant Controller',function(){


        var createController, $q, $scope, $rootScope, $modal, wmsService, variantService, merchService, sizingService, contentIntegrationService;

        beforeEach(function() {module('product-data-ui') });

        beforeEach(inject(function ($injector) {
            var $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            $modal = $injector.get('$modal');
            merchService = $injector.get('merchService');
            wmsService = $injector.get('wmsService');
            variantService = $injector.get('variantService');
            sizingService = $injector.get('sizingService');
            contentIntegrationService = $injector.get('contentIntegrationService');
            $scope = $injector.get('$rootScope').$new();
            createController = function(){
                return $controller(
                    'VariantController',
                    {
                        $scope: $scope,
                        profile: {
                            user: {userId: "adrinkwater"}
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

            it('should have a variable "sortedVariants"', function() {
                expect(controller.sortedVariants).toBeDefined();
                expect(controller.sortedVariants).toEqual({});
            });

            it('should have a variable "pendingActions"', function(){
                var tasks = {
                    errors: {},
                    warnings: {},
                    skuActions: {}
                };
                expect(controller.pendingActions).toBeDefined();
                expect(controller.pendingActions).toEqual(tasks);
            });

            it('should have a variable "Object"', function(){
                expect(controller.Object).toBeDefined();
                expect(controller.Object).toEqual(Object);
            });

            it('should have a variable "userFilter"', function() {
                expect(controller.userFilter).toBeDefined();
                expect(controller.userFilter).toEqual("");
            });

            it('should have a variable "seasonFilter"', function() {
                expect(controller.seasonFilter).toBeDefined();
                expect(controller.seasonFilter).toEqual("");
            });

            it('should have a variable "yearFilter"', function() {
                expect(controller.yearFilter).toBeDefined();
                expect(controller.yearFilter).toEqual("");
            });

            it('should have a variable "years"', function() {
                expect(controller.years).toBeDefined();
                expect(controller.years).toEqual([]);
            });

            it('should have a variable "massActions"', function() {
                expect(controller.massActions).toBeDefined();
                expect(controller.massActions).toEqual({skuActions:{}, errors:0});
            });

        });

        describe('exposed methods', function () {
            var controller;

            beforeEach(function () {
                controller = createController();
            });

            it('should have a method "validateFieldChange"', function () {
                expect(controller.validateFieldChange).toBeDefined();
                expect(controller.validateFieldChange).toEqual(jasmine.any(Function));
            });

            it('should have a method "jumpToLocation"', function () {
                expect(controller.jumpToLocation).toBeDefined();
                expect(controller.jumpToLocation).toEqual(jasmine.any(Function));
            });

            it('should have a method "toList"', function () {
                expect(controller.toList).toBeDefined();
                expect(controller.toList).toEqual(jasmine.any(Function));
            });

            it('should have a method "convertToNumber"', function () {
                expect(controller.convertToNumber).toBeDefined();
                expect(controller.convertToNumber).toEqual(jasmine.any(Function));
            });

            it('should have a method "save"', function () {
                expect(controller.save).toBeDefined();
                expect(controller.save).toEqual(jasmine.any(Function));
            });

            it('should have a method "toggleCheckbox"', function () {
                expect(controller.toggleCheckbox).toBeDefined();
                expect(controller.toggleCheckbox).toEqual(jasmine.any(Function));
            });

            it('should have a method "checkAll"', function () {
                expect(controller.checkAll).toBeDefined();
                expect(controller.checkAll).toEqual(jasmine.any(Function));
            });

            it('should have a method "clearFilter"', function () {
                expect(controller.clearFilter).toBeDefined();
                expect(controller.clearFilter).toEqual(jasmine.any(Function));
            });

            it('should have a method "toggleCatalog"', function () {
                expect(controller.toggleCatalog).toBeDefined();
                expect(controller.toggleCatalog).toEqual(jasmine.any(Function));
            });

            it('should have a method "openModal"', function () {
                expect(controller.openModal).toBeDefined();
                expect(controller.openModal).toEqual(jasmine.any(Function));
            });

            it('should have a method "apply"', function () {
                expect(controller.apply).toBeDefined();
                expect(controller.apply).toEqual(jasmine.any(Function));
            });

            it('should have a method "toErrorString"', function () {
                expect(controller.toErrorString).toBeDefined();
                expect(controller.toErrorString).toEqual(jasmine.any(Function));
            });

            it('should have a method "deleteMassAction"', function () {
                expect(controller.deleteMassAction).toBeDefined();
                expect(controller.deleteMassAction).toEqual(jasmine.any(Function));
            });

            it('should have a method "deletePendingAction"', function () {
                expect(controller.deletePendingAction).toBeDefined();
                expect(controller.deletePendingAction).toEqual(jasmine.any(Function));
            });

        });

        describe('getVariants',function(){

            var controller, product, style, sortedVariants, qoh, venderSku, sizing;

            var wmsDeferred, vendorDeferred, sizingDeferred;

            var resolveWMSPromise = function (withThis) {
                wmsDeferred.resolve(withThis);
                $scope.$apply();
            };

            var resolveVendorPromise = function (withThis) {
                vendorDeferred.resolve(withThis);
                $scope.$apply();
            };

            var resolveSizingPromise = function (withThis) {
                sizingDeferred.resolve(withThis);
                $scope.$apply();
            };


            beforeEach(function () {
                style="TNF0115";

                product = {
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
                };

                sortedVariants = {
                    blue: {
                        axis1Value: "blue",
                        axis2Value: "S",
                        variants: [{
                            sku: "a-b-c",
                            offers: [{
                                wholesalePrice: 350,
                                salePrice: 350,
                                clearancePrice: 350,
                                price: 350,
                                selloutCodeId: 32
                            }],
                            qoh: 4,
                            venderSku: "abc",
                            year: 2015
                        }]
                    }
                };

                qoh = {
                    "a-b-c": 4
                };

                venderSku = {
                    "a-b-c": "abc"
                };

                sizing = {
                    "a-b-c": 2
                };

                wmsDeferred = $q.defer();
                vendorDeferred = $q.defer();
                vendorDeferred.$promise = vendorDeferred.promise;
                sizingDeferred = $q.defer();
                sizingDeferred.$promise = vendorDeferred.promise;


                spyOn(merchService, 'getVendorSku').andReturn(vendorDeferred.promise);
                spyOn(wmsService, 'getQOH').andReturn(wmsDeferred.promise);
                spyOn(sizingService, 'getSizing').andReturn(sizingDeferred.promise);
                spyOn(variantService, 'sortVariants').andReturn(sortedVariants);
                spyOn($rootScope, '$emit');

                controller = createController();
                $rootScope.$broadcast('getVenderSku', style);
                $rootScope.$broadcast('sortVariants', product, style);

                resolveWMSPromise(qoh);
                resolveVendorPromise(venderSku);
                resolveSizingPromise(sizing);
            });

            it('should call merchService.getVendorSku', function(){
                expect(merchService.getVendorSku).toHaveBeenCalledWith(style);
            });

            it('should call sizingService.getSizing', function(){
                expect(sizingService.getSizing).toHaveBeenCalledWith(style);
            });

            it('should call wmsService.getQOH', function(){
                expect(wmsService.getQOH).toHaveBeenCalledWith(product.variants);
            });

            it('should call variantService.sortVariants', function(){
                expect(variantService.sortVariants).toHaveBeenCalledWith(product, qoh, venderSku, sizing);
            });

            it('should call variantService.sortVariants', function(){
                expect($rootScope.$emit).toHaveBeenCalled();
            });

            it('should set sortedVariants on vm.sortedVariants', function() {
                expect(controller.sortedVariants).toBe(sortedVariants);
            });

            it('should set total years on vm.years', function() {
                expect(controller.years).toEqual([2015]);
            });

        });

        describe('toList', function(){
            var controller, errorArray, parsedList;
            beforeEach(function(){
                controller = createController();
                errorArray = ["error1", "error2"];
                parsedList = "<br/>error1<br/><br/>error2<br/><br/>"
            });

            it('should parse an error/warning array to an html string', function(){
                expect(controller.toList(errorArray)).toEqual(parsedList);
            });
        });

        describe('toErrorString', function(){
            var controller, errorObj, parsedList;
            beforeEach(function(){
                controller = createController();
                errorObj = {'TNF0115-A-S': ["error1"], 'TNF0115-A-M': ["error2","error3"]};
                parsedList = "<br/>error1<br/><br/>error2<br/><br/>error3<br/><br/>";
            });

            it('should parse an error/warning object to an html string', function(){
                expect(controller.toErrorString(errorObj)).toEqual(parsedList);
            });
        });

        describe("clearFilter", function () {
            var controller;
            beforeEach(function(){
                controller = createController();
                controller.userFilter = 'Red';
                controller.yearFilter = 2015;
                controller.seasonFilter = 'SS0';
            });

            it("should clear all filters", function () {
                controller.clearFilter();
                expect(controller.userFilter).toEqual('');
                expect(controller.yearFilter).toEqual('');
                expect(controller.seasonFilter).toEqual('');
            });
        });

        describe("toggleCatalog", function () {
            var controller, catalog;
            beforeEach(function(){
                controller = createController();
                controller.sortedVariants = [
                    {
                        variants: [
                            {
                                catalogModel: ['bcs', 'dogfunk'],
                                catalogAssignments: ['bcs', 'dogfunk']
                            }
                        ]
                    }
                ];
                spyOn(controller, 'validateFieldChange').andReturn();
            });

            it("should remove catalog and validate", function () {
                catalog = 'dogfunk';
                controller.toggleCatalog(controller.sortedVariants[0], controller.sortedVariants[0].variants[0], catalog);
                catalog = 'bcs';
                controller.toggleCatalog(controller.sortedVariants[0], controller.sortedVariants[0].variants[0], catalog);
                expect(controller.sortedVariants[0].variants[0].catalogModel).toEqual([]);
                expect(controller.validateFieldChange).toHaveBeenCalled();
            });
        });

        describe("openModal", function () {
            var controller, mockModal, mockData, style, swatch, url, variants;
            var contentIntegrationDeferred;

            var resolveContentIntegrationDeferred = function (withThis) {
                contentIntegrationDeferred.resolve(withThis);
                $scope.$apply();
            };

            var rejectContentIntegrationDeferred = function (withThis) {
                contentIntegrationDeferred.reject(withThis);
                $scope.$apply();
            };

            beforeEach(function(){
                controller = createController();
                mockModal = {
                    result: {
                        then: function(confirmCallback, cancelCallback) {
                            //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                            this.confirmCallBack = confirmCallback;
                            this.cancelCallback = cancelCallback;
                        }
                    },
                    close: function( item ) {
                        //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
                        this.result.confirmCallBack( item );
                    },
                    dismiss: function( type ) {
                        //The user clicked cancel on the modal dialog, call the stored cancel callback
                        this.result.cancelCallback( type );
                    }
                };

                style = 'TNF0115';
                swatch = 'RED';
                url = 'http://backcountry.com/test';
                variants = ['TNF0115-RED-S', 'TNF0115-RED-M', 'TNF0115-RED-L'];

                mockData = {
                    style: style,
                    identifier: swatch,
                    user: 'adrinkwater',
                    url: url,
                    skus: 'TNF0115-RED-S, TNF0115-RED-M, TNF0115-RED-L',
                    description: 'this is a description'
                };

                contentIntegrationDeferred = $q.defer();
                spyOn($modal, 'open').andReturn(mockModal);
                spyOn(alertify, 'success');
                spyOn(alertify, 'error');
                spyOn(contentIntegrationService, 'report').andReturn(contentIntegrationDeferred.promise);
            });

            it('should open modal', function(){
                controller.openModal(style, swatch, url, variants);
                expect($modal.open).toHaveBeenCalled();
            });

            it('should send a report', function(){
                controller.openModal(style, swatch, url, variants);
                mockModal.close(mockData);
                resolveContentIntegrationDeferred();
                expect(contentIntegrationService.report).toHaveBeenCalledWith(mockData);
                expect(alertify.success).toHaveBeenCalled();
            });

            it('should handle service error', function(){
                controller.openModal(style, swatch, url, variants);
                mockModal.close(mockData);
                rejectContentIntegrationDeferred();
                expect(contentIntegrationService.report).toHaveBeenCalledWith(mockData);
                expect(alertify.error).toHaveBeenCalled();
            });

        });

        describe('validateFieldChange', function(){
            var controller, sku, key, value, pendingActions, returnedObject, validationDeferred;
            var resolveValidationPromise = function (withThis) {
                validationDeferred.resolve(withThis);
                $scope.$apply();
            };

            beforeEach(function(){
                controller = createController();
                sku = "TNF0115-DORB-M";
                key = "clearancePrice";
                value = 120;
                returnedObject = {
                    skuActions: [{
                        newValues: {}
                    }],
                    warnings: ["warning1", "warning2"],
                    errors: ["error1"]
                };
                pendingActions = {
                    skuActions: {
                        'TNF0115-DORB-M': {
                            clearancePrice: {

                            }
                        }
                    },
                    warnings: {
                        'TNF0115-DORB-M': {
                            clearancePrice: ["warning1", "warning2"]

                        }
                    },
                    errors: {
                        'TNF0115-DORB-M': {
                            clearancePrice: ["error1"]
                        }
                    }
                };
                spyOn(variantService.matValidationResource, 'save').andCallFake(function(){

                    validationDeferred = $q.defer();
                    validationDeferred.$promise = validationDeferred.promise;
                    return validationDeferred;
                });
            });

            it('should handle a bad input', function(){
                controller.validateFieldChange(sku, key, value);
                resolveValidationPromise(returnedObject);

                expect(controller.pendingActions).toEqual(pendingActions);
            });

            it('should handle a good input', function(){
                pendingActions.warnings = {};
                pendingActions.errors = {};
                returnedObject.warnings = [];
                returnedObject.errors = [];

                controller.validateFieldChange(sku, key, value);
                resolveValidationPromise(returnedObject);

                expect(controller.pendingActions).toEqual(pendingActions);
            });

            it('should remove the style key from errors/warnings if the value is null', function(){
                pendingActions.warnings = {};
                pendingActions.errors = {};
                pendingActions.skuActions = {};

                controller.validateFieldChange(sku, key, value);
                resolveValidationPromise(returnedObject);

                value = null;

                controller.validateFieldChange(sku, key, value);

                expect(controller.pendingActions).toEqual(pendingActions);
            });

            it('should detect NaN inputs without calling the service', function(){
                pendingActions.warnings = {};
                pendingActions.errors[sku][key] = ["Not a number."];
                pendingActions.skuActions[sku][key] = {};

                value = "NaN";
                controller.validateFieldChange(sku, key, value);

                expect(controller.pendingActions).toEqual(pendingActions);
            });

            describe('validateFieldChange on non-price fields', function(){
                var controller, sku, key, value, pendingActions;

                beforeEach(function(){
                    controller = createController();
                    sku = "TNF0115-DORB-M";
                    key = "year";
                    value = 2017;
                    pendingActions = {
                        skuActions: {
                            "TNF0115-DORB-M": {
                                year: {
                                    newValue: 2017
                                }
                            }
                        },
                        errors: {},
                        warnings: {}
                    };
                });

                it('should change the field on a non-price field', function(){
                    controller.validateFieldChange(sku, key, value);
                    pendingActions.warnings = {};
                    pendingActions.errors = {};
                    returnedObject.skuActions = [{newValues:{year:2017}}];
                    returnedObject.warnings = [];
                    returnedObject.errors = [];
                    resolveValidationPromise(returnedObject);
                    expect(controller.pendingActions).toEqual(pendingActions);
                });

                it('should handle assignedCatalogs field change', function(){
                    var previousValue = [];
                    key = 'catalogAssignments';
                    value = ['bcs', 'dogfunk'];
                    pendingActions = {
                        skuActions: {
                            "TNF0115-DORB-M": {
                                catalogAssignments: {
                                    newValue: {
                                        bcs: 'ADD',
                                        dogfunk: 'ADD'
                                    },
                                    margin: undefined,
                                    marginPercent: undefined,
                                    percentOff: undefined,
                                    previousValue: previousValue,
                                    swatch: undefined
                                }
                            }
                        },
                        errors: {},
                        warnings: {}
                    };
                    controller.validateFieldChange(sku, key, value, previousValue);
                    pendingActions.warnings = {};
                    pendingActions.errors = {};
                    returnedObject.skuActions = [{newValues:{catalogAssignments:{bcs: 'ADD', dogfunk: 'ADD'}}}];
                    returnedObject.warnings = [];
                    returnedObject.errors = [];
                    expect(variantService.matValidationResource.save).toHaveBeenCalledWith({}, [{sku:'TNF0115-DORB-M', newValues:{catalogAssignments:{bcs: 'ADD', dogfunk: 'ADD'}}}]);
                    resolveValidationPromise(returnedObject);
                    expect(controller.pendingActions).toEqual(pendingActions);

                    previousValue = ['wm'];
                    pendingActions.skuActions['TNF0115-DORB-M'].catalogAssignments.newValue.wm = 'REMOVE';
                    pendingActions.skuActions['TNF0115-DORB-M'].catalogAssignments.previousValue = previousValue;
                    controller.validateFieldChange(sku, key, value, previousValue);
                    returnedObject.skuActions = [{newValues:{catalogAssignments:{bcs: 'ADD', dogfunk: 'ADD', wm : 'REMOVE'}}}];
                    expect(variantService.matValidationResource.save).toHaveBeenCalledWith({}, [{sku:'TNF0115-DORB-M', newValues:{catalogAssignments:{bcs: 'ADD', dogfunk: 'ADD', wm : 'REMOVE'}}}]);
                    resolveValidationPromise(returnedObject);

                    expect(controller.pendingActions).toEqual(pendingActions);
                });
            });
            it("should delete single sku in massActions if there is a conflict", function(){
                controller.massActions = {
                    skuActions: {
                        clearancePercent: {
                            dictionary: {'TNF0115-DORB-M': 1437},
                            changes: {
                                1437:
                                {
                                    newValue: 20,
                                    skus: ['TNF0115-DORB-M'],
                                    errors: {},
                                    warnings: {"TNF0115-2-A": ['TNF0115-DORB-M warning2']}
                                }
                            }
                        }
                    },
                    errors: 0
                };
                controller.validateFieldChange(sku, key, value);
                resolveValidationPromise(returnedObject);
                expect(controller.massActions).toEqual({skuActions:{}, errors:0});
            });
        });


        describe('apply', function(){
            var controller, key, newValue, skuActionsArray, massActions, returnedObject, returnedObject1, validationDeferred, validationDeferred1, called;
            var resolveValidationPromise = function (withThis) {
                validationDeferred.resolve(withThis);
                $scope.$apply();
            };

            var resolveValidationPromise1 = function (withThis) {
                validationDeferred1.resolve(withThis);
                $scope.$apply();
            };

            beforeEach(function(){
                controller = createController();
                key = "clearancePercent";
                newValue = 20;
                controller.sortedVariants = [{
                    variants: [
                        {
                            sku: "TNF0115-1-A",
                            check: true
                        }
                    ]
                },
                {
                    variants: [
                        {
                            sku: "TNF0115-2-A",
                            check: true
                        },
                        {
                            sku: "TNF0115-2-B",
                            check: false
                        }
                    ]
                }];

                skuActionsArray = [{
                    sku: "TNF0115-1-A",
                    newValues: {
                        clearancePercent: newValue
                    }
                },
                {
                    sku: "TNF0115-2-A",
                    newValues: {
                        clearancePercent: newValue
                    }
                }];

                returnedObject = {
                    skuActions: [{
                        sku: "TNF0115-1-A",
                        newValues: {}
                    },
                    {
                        sku: "TNF0115-2-A",
                        newValues: {}
                    }],
                    warnings: ["TNF0115-1-A warning1", "TNF0115-2-A warning2"],
                    errors: ["TNF0115-1-A error1"]
                };

                returnedObject1 = {
                    skuActions: [{
                        sku: "TNF0115-1-A",
                        newValues: {}
                    },
                        {
                            sku: "TNF0115-2-B",
                            newValues: {}
                        }],
                    warnings: ["TNF0115-1-A warning3", "TNF0115-2-B warning2"],
                    errors: []
                };

                massActions = {
                    skuActions: {
                        clearancePercent: {
                            dictionary: {"TNF0115-1-A": 1437, "TNF0115-2-A": 1437},
                            changes: {
                                1437:
                                {
                                    newValue: 20,
                                    skus: ["TNF0115-1-A", "TNF0115-2-A"],
                                    errors: {"TNF0115-1-A": ["TNF0115-1-A error1"]},
                                    warnings: {"TNF0115-1-A": ["TNF0115-1-A warning1"], "TNF0115-2-A": ["TNF0115-2-A warning2"]}
                                }
                            }
                        }
                    },
                    errors: 1
                };
                validationDeferred = $q.defer();
                validationDeferred.$promise = validationDeferred.promise;
                validationDeferred1 = $q.defer();
                validationDeferred1.$promise = validationDeferred1.promise;

                called = 0;
                spyOn(variantService.matValidationResource, 'save').andCallFake(function(){
                    if(called == 1) {
                        return validationDeferred;
                    }
                    else
                        return validationDeferred1;
                });
                spyOn(Date, 'now').andCallFake(function(){
                    called++;
                    return 1436+called;
                });
            });

            it('should handle a bad input', function(){
                controller.apply(key, newValue);
                resolveValidationPromise(returnedObject);

                expect(controller.massActions).toEqual(massActions);
            });

            it('should handle a good input', function(){
                massActions.skuActions.clearancePercent.changes["1437"].warnings = {};
                massActions.skuActions.clearancePercent.changes["1437"].errors = {};
                massActions.errors = 0;
                returnedObject.warnings = [];
                returnedObject.errors = [];

                controller.apply(key, newValue);
                resolveValidationPromise(returnedObject);

                expect(controller.massActions).toEqual(massActions);
            });

            it('should return if the value or the key is null', function(){
                massActions.skuActions = {};
                massActions.errors = 0;


                newValue = null;
                controller.apply(key, newValue);
                expect(controller.massActions).toEqual(massActions);
                newValue = 20;
                key = null;
                controller.apply(key, newValue);
                expect(controller.massActions).toEqual(massActions);
            });
            it('should handle conflicting changes', function(){
                controller.apply(key, newValue);
                resolveValidationPromise(returnedObject);
                controller.sortedVariants = [{
                    variants: [
                        {
                            sku: "TNF0115-1-A",
                            check: true
                        }
                    ]
                },
                {
                    variants: [
                        {
                            sku: "TNF0115-2-A",
                            check: false
                        },
                        {
                            sku: "TNF0115-2-B",
                            check: true
                        }
                    ]
                }];


                massActions = {
                    skuActions: {
                        clearancePercent: {
                            dictionary: {"TNF0115-1-A": 1438, "TNF0115-2-A": 1437, "TNF0115-2-B": 1438},
                            changes: {
                                1437:
                                {
                                    newValue: 20,
                                    skus: ["TNF0115-2-A"],
                                    errors: {},
                                    warnings: {"TNF0115-2-A": ["TNF0115-2-A warning2"]}
                                },
                                1438:
                                {
                                    newValue: 30,
                                    skus: ["TNF0115-1-A", "TNF0115-2-B"],
                                    errors: {},
                                    warnings: {"TNF0115-1-A": ["TNF0115-1-A warning3"], "TNF0115-2-B": ["TNF0115-2-B warning2"]}
                                }
                            }
                        }
                    },
                    errors: 0
                };
                newValue = 30;
                controller.apply(key, newValue);
                resolveValidationPromise1(returnedObject1);
                expect(controller.massActions).toEqual(massActions);
            });

            it('should delete pendingAction if it has conflict', function(){
                controller.pendingActions = {
                    skuActions: {
                        'TNF0115-1-A': {
                            clearancePrice: {
                                newValue: 120
                            }
                        }
                    },
                    warnings: {},
                    errors: {}
                };
                controller.apply(key, newValue);
                resolveValidationPromise(returnedObject);
                expect(controller.pendingActions).toEqual({skuActions:{}, warnings:{}, errors:{}});

            });
        });


        describe('deleteMassAction', function(){
            var controller, dateKey, massActions;

            beforeEach(function(){
                controller = createController();
                dateKey = 1438;
                controller.massActions = {
                    skuActions: {
                        clearancePercent: {
                            dictionary: {"TNF0115-1-A": 1438, "TNF0115-2-A": 1437, "TNF0115-2-B": 1438},
                            changes: {
                                1437:
                                {
                                    newValue: 20,
                                    skus: ["TNF0115-2-A"],
                                    errors: {},
                                    warnings: {"TNF0115-2-A": ["TNF0115-2-A warning2"]}
                                },
                                1438:
                                {
                                    newValue: 30,
                                    skus: ["TNF0115-1-A", "TNF0115-2-B"],
                                    errors: {},
                                    warnings: {"TNF0115-1-A": ["TNF0115-1-A warning3"], "TNF0115-2-B": ["TNF0115-2-B warning2"]}
                                }
                            }
                        }
                    },
                    errors: 0
                };

                massActions = {
                    skuActions: {
                        clearancePercent: {
                            dictionary: {"TNF0115-2-A": 1437},
                            changes: {
                                1437:
                                {
                                    newValue: 20,
                                    skus: ["TNF0115-2-A"],
                                    errors: {},
                                    warnings: {"TNF0115-2-A": ["TNF0115-2-A warning2"]}
                                }
                            }
                        }
                    },
                    errors: 0
                };

            });

            it('should delete a massAction with dateKey', function(){
                controller.deleteMassAction("clearancePercent", dateKey);

                expect(controller.massActions).toEqual(massActions);
            });

        });

        describe('deletePendingAction', function(){
            var controller, sku, key;

            beforeEach(function(){
                controller = createController();
                sku = "TNF0115-DORB-M";
                key = "clearancePrice";
                controller.pendingActions = {
                    skuActions: {
                        'TNF0115-DORB-M': {
                            clearancePrice: {
                                newValue: 150,
                                previousValue: 100
                            }
                        }
                    },
                    warnings: {
                        'TNF0115-DORB-M': {
                            clearancePrice: ["warning1", "warning2"]

                        }
                    },
                    errors: {
                        'TNF0115-DORB-M': {
                            clearancePrice: ["error1"]
                        }
                    }
                };
                controller.sortedVariants = [
                    {
                        variants: [
                            {
                                sku: 'TNF0115-DORB-M',
                                clearancePrice: 100,
                                clearanceModel: 150,
                                offers : [{
                                    clearancePrice: 100
                                }
                                ]
                            }

                        ]
                    }
                ];

            });

            it('should delete a pendingAction with sku and key', function(){
                controller.deletePendingAction(sku, key);

                expect(controller.pendingActions).toEqual({errors:{}, warnings:{}, skuActions:{}});
            });

            it ('should update the view model', function(){
                var swatch = controller.sortedVariants[0];
                controller.deletePendingAction(sku, key, swatch);

                expect(swatch.variants[0].clearanceModel).toEqual(swatch.variants[0].offers[0].clearancePrice);
            });

        });



        describe('save', function(){
            var controller, pendingActions, saveDeferred, merchAction, sortedVariants, massActions;
            var resolveSavePromise = function (withThis) {
                saveDeferred.resolve(withThis);
                $scope.$apply();
            };

            beforeEach(function(){
                controller = createController();
                sortedVariants = [{
                    variants: [
                        {
                            sku: 'TNF0115-DORB-M',
                            offers: [{
                            }],
                            clearanceModel:120,
                            yearModel: 1495
                        }
                    ]
                }];

                massActions = {
                    skuActions: {
                        clearancePercent: {
                            dictionary: {"TNF0115-1-A": 1438, "TNF0115-2-A": 1437, "TNF0115-2-B": 1438},
                            changes: {
                                1437:
                                {
                                    newValue: 20,
                                    skus: ["TNF0115-2-A"],
                                    errors: {},
                                    warnings: {"TNF0115-2-A": ["TNF0115-2-A warning2"]}
                                },
                                1438:
                                {
                                    newValue: 30,
                                    skus: ["TNF0115-1-A", "TNF0115-2-B"],
                                    errors: {},
                                    warnings: {"TNF0115-1-A": ["TNF0115-1-A warning3"], "TNF0115-2-B": ["TNF0115-2-B warning2"]}
                                }
                            }
                        },
                        salePercent: {
                            dictionary: {"TNF0115-1-A": 1439},
                            changes: {
                                1439:
                                {
                                    newValue: 30,
                                    skus: ["TNF0115-1-A"],
                                    errors: {},
                                    warnings: {"TNF0115-1-A": ["TNF0115-1-A warning1"]}
                                }
                            }
                        }
                    },
                    errors: 0
                };

                pendingActions = {
                    skuActions: {
                        'TNF0115-DORB-M': {
                            clearancePrice: {
                                newValue: 120
                            },
                            year: {
                                newValue: 1495
                            }
                        }
                    },
                    warnings: {},
                    errors: {}
                };

                merchAction = {
                    title: "Item Editor Action For TNF0115",
                    createdBy: 'adrinkwater',
                    modifiedBy: 'adrinkwater',
                    startDate: 1437406643431,
                    skuActions: [{
                        sku: 'TNF0115-DORB-M',
                        newValues: {
                            clearancePrice: 120,
                            year: 1495
                        }
                    },
                    {
                        sku: 'TNF0115-1-A',
                        newValues: {
                            salePercent:30,
                            clearancePercent: 30
                        }
                    },
                    {
                        sku: 'TNF0115-2-A',
                        newValues: {
                            clearancePercent: 20
                        }
                    },
                    {
                        sku: 'TNF0115-2-B',
                        newValues: {
                            clearancePercent: 30
                        }
                    }]
                };

                saveDeferred = $q.defer();
                saveDeferred.$promise = saveDeferred.promise;
                spyOn(variantService.matSaveResource, 'save').andReturn(saveDeferred);
                spyOn(Date, 'now').andReturn(1437406643431);
            });

            it ('should should save with the correct merchAction', function(){
                controller.sortedVariants = sortedVariants;
                controller.pendingActions = pendingActions;
                controller.massActions = massActions;
                controller.save();

                resolveSavePromise();

                expect(variantService.matSaveResource.save).toHaveBeenCalledWith({}, merchAction);
                expect(controller.sortedVariants[0].variants[0].clearanceModel).toEqual(null);
                expect(controller.sortedVariants[0].variants[0].offers[0].clearancePrice).toEqual(120);
                expect(controller.sortedVariants[0].variants[0].seasonModel).toEqual(null);
                expect(controller.sortedVariants[0].variants[0].yearModel).toEqual(1495);
                expect(controller.sortedVariants[0].variants[0].year).toEqual(1495);
                expect(controller.sortedVariants[0].variants[0].selloutModel).toEqual(null);
                expect(controller.massActions).toEqual({skuActions:{}, errors:0});
                expect(controller.pendingActions).toEqual({errors:{}, warnings:{}, skuActions:{}});
            });

        });



        describe('toggleCheckbox and checkAll', function(){
            var controller;
            beforeEach(function(){
                controller = createController();
                controller.yearFilter = 2015;
                controller.sortedVariants = [
                    {
                        variants: [
                            {
                                check: false,
                                year: 2015,
                                season: 'COR'
                            },
                            {
                                check: false,
                                year: 2014,
                                season: 'COR'
                            }
                        ],
                        check: false
                    },
                    {
                        variants: [
                            {
                                check: false,
                                year: 2015,
                                season: 'COR'
                            }
                        ],
                        check: false
                    }
                ];
            });

            it('should toggle filtered variants when a swatch is toggled', function(){
                controller.toggleCheckbox(false, controller.sortedVariants[0]);
                expect(controller.sortedVariants[0].variants[0].check).toEqual(true);
                expect(controller.sortedVariants[0].variants[1].check).toEqual(false);
            });

            it('should toggle every variant when all is toggled', function(){
                controller.checkAll(false);
                expect(controller.sortedVariants[0].variants[0].check).toEqual(true);
                expect(controller.sortedVariants[0].variants[1].check).toEqual(false);
                expect(controller.sortedVariants[1].variants[0].check).toEqual(true);
                expect(controller.sortedVariants[0].check).toEqual(true);
                expect(controller.sortedVariants[1].check).toEqual(true);
            });
        });
    });
})();