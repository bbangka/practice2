(function() {
    'use strict';

    angular
        .module('product-data-ui')
        .controller('VariantController', VariantController);


    function VariantController($scope, $q, $location, $anchorScroll, $filter, $modal, variantService, wmsService, merchService, sizingService, contentIntegrationService, profile) {
        var vm = this;
        var vendorDeferred;
        var qohDeferred;
        var sizingDeferred;

        vm.Object = Object;
        vm.sortedVariants = [];
        vm.pendingActions = {};
        vm.pendingActions.errors = {};
        vm.pendingActions.warnings = {};
        vm.pendingActions.skuActions = {};
        vm.massActions = {};
        vm.massActions.skuActions = {};
        vm.massActions.errors = 0;
        vm.userFilter = '';
        vm.yearFilter = '';
        vm.seasonFilter = '';
        vm.years = [];

        vm.clearFilter = clearFilter;
        vm.save = save;
        vm.validateFieldChange = validateFieldChange;
        vm.jumpToLocation = jumpToLocation;
        vm.convertToNumber=variantService.convertToNumber;
        vm.toList = toList;
        vm.convertToSizeValue = convertToSizeValue;
        vm.toggleCheckbox = toggleCheckbox;
        vm.checkAll = checkAll;
        vm.apply = apply;
        vm.toErrorString = toErrorString;
        vm.deleteMassAction = deleteMassAction;
        vm.deletePendingAction = deletePendingAction;
        vm.cancel = cancel;
        vm.toggleCatalog = toggleCatalog;
        vm.openModal = openModal;


        function SkuAction(newValues, previousValue, key) {
            if(newValues.margin) {
                this.margin = newValues.margin;
            }
            if(newValues.marginPercent){
                this.marginPercent = newValues.marginPercent;
            }
            if(newValues.percentOff){
                this.percentOff = newValues.percentOff;
            }
            if(isNaN(newValues[key]))
                this.newValue = newValues[key];
            else
                this.newValue = parseFloat(newValues[key]);
            this.previousValue = previousValue;
        }

        $scope.$on('getVenderSku', function(event, style){
            getSizing(style);
            getVendorSku(style);
        });

        $scope.$on('sortVariants', function(event, skuData, style){
            clear();
            getQOH(skuData.variants);
            sortVariants(skuData, style);
        });


        function openModal (style, identifier, swatchName, images) {
            var listImages = [];
            listImages.push({
                urls: images.urls,
                blurb: 'Main Image'
            });
            angular.forEach(images.detailImages, function(image){
                listImages.push({
                    urls: image.urls,
                    blurb: image.blurb
                });
            });

            var modalInstance = $modal.open({
                templateUrl: 'product-data-ui/product-data/modal.template.jade',
                controller: 'ModalController as mc',
                size: 'lg',
                resolve: {
                    data: function() {
                        return {
                            style: style,
                            skuPart: identifier,
                            user: profile.user.userId
                        }
                    },
                    images: function(){
                        return listImages;
                    },
                    swatch: function(){
                        return swatchName
                    }
                }
            });

            modalInstance.result.then(function (result) {
                contentIntegrationService.report(result)
                    .then(function(){
                        alertify.set({ delay: 4000 });
                        alertify.success('Report Received!');
                    }, function(){
                        alertify.set({ delay: 4000 });
                        alertify.error('Report NOT Received');
                    });
            });
        }

        function toggleCatalog(firstSwatch, variant, catalog) {
            var index = variant.catalogModel.indexOf(catalog);

            if(index > 0)
                variant.catalogModel.splice(index, index);
            else if(index > -1)
                variant.catalogModel.shift();
            else
                variant.catalogModel.push(catalog);

            vm.validateFieldChange(variant.sku, 'catalogAssignments', variant.catalogModel, variant.catalogAssignments, firstSwatch);
        }

        function getYears(){
            vm.years = [];
            angular.forEach(vm.sortedVariants, function(swatch){
                angular.forEach(swatch.variants, function(variant){
                    if(vm.years.indexOf(variant.year) < 0)
                        vm.years.push(variant.year)
                });
            });
            vm.years.sort();
        }

        function toggleCheckbox(check, swatch){
            var filter = $filter('filter');

            var filteredVariants = filter(swatch.variants, vm.userFilter);
            filteredVariants = filter(filteredVariants, {year: vm.yearFilter});
            filteredVariants = filter(filteredVariants, {season: vm.seasonFilter});

            if(filteredVariants.length > 0) {
                swatch.check = !check;
                angular.forEach(filteredVariants, function(variant){
                    variant.check = !check;
                });
            }
        }

        function checkAll(check){
            angular.forEach(vm.sortedVariants, function(swatch){
                toggleCheckbox(check, swatch);
            });
        }

        function save(){

            if (Object.keys(vm.pendingActions.errors).length > 0 || vm.massActions.errors > 0)
                return;

            var postSkuActions = [];
            var postMerchAction = {};

            postMerchAction.title = "Item Editor Action For " + vm.sortedVariants[0].variants[0].sku.substring(0,7);
            postMerchAction.createdBy = profile.user.userId;
            postMerchAction.modifiedBy = profile.user.userId;
            postMerchAction.startDate = Date.now();

            //add pendingActions
            angular.forEach(vm.pendingActions.skuActions, function(task, sku){
                var skuAction = {};

                skuAction.sku = sku;
                skuAction.newValues = {};

                angular.forEach(task, function(value, key){
                    skuAction.newValues[key] = value.newValue;
                });

                postSkuActions.push(skuAction);
            });

            //add massActions
            angular.forEach(vm.massActions.skuActions, function(value, key){
                angular.forEach(value.dictionary, function(dateKey, sku){
                    var skuAction = {};
                    skuAction.sku = sku;
                    skuAction.newValues = {};
                    skuAction.newValues[key] = value.changes[dateKey].newValue;

                    deleteMassActionElement(sku, key);

                    angular.forEach(vm.massActions.skuActions, function(subValue, subKey){
                        var date = subValue.dictionary[sku];
                        if(date) {
                            skuAction.newValues[subKey] = subValue.changes[date].newValue;
                            deleteMassActionElement(sku, subKey);
                        }
                    });

                    postSkuActions.push(skuAction);
                });
            });


            postMerchAction.skuActions = postSkuActions;

            variantService.savePriceChange(postMerchAction)
                .then(function(result){
                    vm.pendingActions = {};
                    vm.pendingActions.errors = {};
                    vm.pendingActions.warnings = {};
                    vm.pendingActions.skuActions = {};
                    vm.massActions = {};
                    vm.massActions.skuActions = {};
                    vm.massActions.errors = 0;

                    //clear form model
                    angular.forEach(vm.sortedVariants, function(swatch){
                        angular.forEach(swatch.variants, function(variant){
                            if(variant.wholesaleModel) {
                                variant.offers[0].wholesalePrice = variant.wholesaleModel;
                                variant.wholesaleModel = null;
                            }
                            if(variant.regularModel) {
                                variant.offers[0].price = variant.regularModel;
                                variant.regularModel = null;
                            }
                            if(variant.saleModel) {
                                variant.offers[0].salePrice = variant.saleModel;
                                variant.saleModel = null;
                            }
                            if(variant.clearanceModel) {
                                variant.offers[0].clearancePrice = variant.clearanceModel;
                                variant.clearanceModel = null;
                            }
                            if(variant.gruppoModel) {
                                variant.offers[0].gruppoPrice = variant.gruppoModel;
                                variant.gruppoModel = null;
                            }
                            if(variant.flashModel) {
                                variant.offers[0].flashPrice = variant.flashModel;
                                variant.flashModel = null;
                            }

                            variant.season = variant.seasonModel;
                            variant.year = variant.yearModel;
                            variant.offers[0].selloutCodeId= variant.selloutModel;
                            variant.catalogAssignments = [];
                            angular.forEach(variant.catalogModel, function(catalog){
                                variant.catalogAssignments.push(catalog);
                            });

                        });
                    });
                    clearFilter();
                    vm.checkAll(true);
                    vm.checkbox = false;

                    alertify.set({ delay: 4000 });
                    alertify.success('Changes received!');
                }, function(error){
                    alertify.set({ delay: 8000 });
                    alertify.error('Changes NOT received! <br/> Please try again or contact an administrator.');
                });
        }

        function cancel(){
            vm.pendingActions = {};
            vm.pendingActions.errors = {};
            vm.pendingActions.warnings = {};
            vm.pendingActions.skuActions = {};
            vm.massActions = {};
            vm.massActions.skuActions = {};
            vm.massActions.errors = 0;

            //clear form model
            angular.forEach(vm.sortedVariants, function(swatch){
                angular.forEach(swatch.variants, function(variant){
                    variant.seasonModel = variant.season;
                    variant.yearModel = variant.year;
                    variant.selloutModel = variant.offers[0].selloutCodeId;
                    variant.catalogModel = [];
                    angular.forEach(variant.catalogAssignments, function(catalog){
                        variant.catalogModel.push(catalog)
                    });

                    variant.wholesaleModel = variant.offers[0].wholesalePrice;
                    variant.regularModel = variant.offers[0].price;
                    variant.saleModel = variant.offers[0].salePrice;
                    variant.clearanceModel=variant.offers[0].clearancePrice;
                    variant.gruppoModel = variant.offers[0].gruppoPrice;
                    variant.flashModel = variant.offers[0].flashPrice;

                });
            });
            clearFilter();
            vm.checkbox = false;
            vm.checkAll(true);
        }

        function toList(errorArray){
            var errString = '<br/>';
            angular.forEach(errorArray,function(errorElem){
                errString+= errorElem+"<br/><br/>";
            });
            return errString;
        }

        function clearFilter() {
            vm.userFilter = '';
            vm.yearFilter = '';
            vm.seasonFilter = '';
        }

        function clear() {
            clearFilter();
            vm.sortedVariants = {};
            vm.pendingActions = {};
            vm.pendingActions.errors = {};
            vm.pendingActions.warnings = {};
            vm.pendingActions.skuActions = {};

            vm.massActions = {};
            vm.massActions.skuActions = {};
            vm.massActions.errors = 0;
        }

        function sortVariants(skuData){
            var tasks = [];
            tasks.push(qohDeferred.promise);
            tasks.push(vendorDeferred.promise);
            tasks.push(sizingDeferred.promise);

            $q.all(tasks).then(function (data) {
                vm.sortedVariants = variantService.sortVariants(skuData, data[0], data[1], data[2]);
                $scope.$emit('variantsSorted');
                getYears();
            });
        }
        
        function getQOH(variants){
            qohDeferred = $q.defer();
            wmsService.getQOH(variants)
                .then(function(result){
                    qohDeferred.resolve(result);
                }, function(error){
                    return 0;
                });
        }

        function getSizing(style){
            sizingDeferred = $q.defer();
            sizingService.getSizing(style)
                .then(function(result){
                    sizingDeferred.resolve(result);
                });
        }

        function getVendorSku(style){
            vendorDeferred = $q.defer();
            merchService.getVendorSku(style)
                .then(function(result){
                    vendorDeferred.resolve(result);
                });
        }

        function convertToSizeValue(variant){
            return variant.sizing;
        }

        function jumpToLocation(sku, key) {
            if(vm.pendingActions.skuActions[sku][key].swatch.isOpen) {
                jump();
            } else {
                vm.pendingActions.skuActions[sku][key].swatch.isOpen = true;
                window.setTimeout(jump, 250);
            }

            function jump(){
                var old = $location.hash();
                $location.hash(sku + key);
                $anchorScroll.yOffset = - 200;
                $anchorScroll();
                //reset to old to keep any additional routing logic from kicking in
                $location.hash(old);
                document.getElementById(sku+key).focus();
                window.scrollTo(window.pageXOffset, window.pageYOffset - 200);
            }
        }

        function validateFieldChange(sku, key, newValue, previousValue, swatch){

            //Create newValues for MAT if catalogAssignment is changed
            if(key === 'catalogAssignments') {
                var catalogObj = {};
                angular.forEach(newValue, function(newCatalog){
                    if(previousValue.indexOf(newCatalog) === -1) {
                        catalogObj[newCatalog] = 'ADD';
                    }
                });
                angular.forEach(previousValue, function(oldCatalog){
                    if(newValue.indexOf(oldCatalog) === -1) {
                        catalogObj[oldCatalog] = 'REMOVE';
                    }
                });

                if (Object.keys(catalogObj).length === 0)
                    newValue = null;
                else
                    newValue = catalogObj;
            }

            //Clear values if empty or unchanged
            if (!newValue|| newValue === "" || previousValue == newValue) {
                deletePendingAction(sku, key);
                return;
            }

            //if contained in massActions, delete
            if(key === 'clearancePrice')
                deleteMassActionElement(sku, 'clearancePercent');
            if(key === 'salePrice')
                deleteMassActionElement(sku, 'salePercent');
            if(key === 'gruppoPrice')
                deleteMassActionElement(sku, 'gruppoPercent');
            if(key === 'flashPrice')
                deleteMassActionElement(sku, 'flashPercent');

            //Verify price field changes are numbers
            if (isNaN(newValue) && key.indexOf('Price') !== -1) {
                if (!vm.pendingActions.skuActions[sku])
                    vm.pendingActions.skuActions[sku] = {};
                if (!vm.pendingActions.warnings[sku])
                    vm.pendingActions.warnings[sku] = {};
                if (!vm.pendingActions.errors[sku])
                    vm.pendingActions.errors[sku] = {};

                delete vm.pendingActions.warnings[sku][key];
                if (Object.keys(vm.pendingActions.warnings[sku]).length === 0)
                    delete vm.pendingActions.warnings[sku];

                vm.pendingActions.errors[sku][key] = ["Not a number."];
                vm.pendingActions.skuActions[sku][key] = {};
                vm.pendingActions.skuActions[sku][key].swatch = swatch;
                return;
            }

            //Create skuActionsArray to be validated
            var skuActionsArray = [];
            var skuAction = {};
            skuAction.sku = sku;
            skuAction.newValues = {};
            skuAction.newValues[key] = newValue;
            skuActionsArray.push(skuAction);

            variantService.validateFieldChange(skuActionsArray)
                .then(function(result){
                    if (!vm.pendingActions.skuActions[sku])
                        vm.pendingActions.skuActions[sku] = {};
                    if (!vm.pendingActions.warnings[sku])
                        vm.pendingActions.warnings[sku] = {};
                    if (!vm.pendingActions.errors[sku])
                        vm.pendingActions.errors[sku] = {};

                    delete vm.pendingActions.errors[sku][key];
                    delete vm.pendingActions.warnings[sku][key];

                    if (result.errors.length != 0)
                        vm.pendingActions.errors[sku][key] = result.errors;
                    if (result.warnings.length != 0)
                        vm.pendingActions.warnings[sku][key] = result.warnings;
                    if (result.skuActions.length != 0) {
                        vm.pendingActions.skuActions[sku][key] = new SkuAction(result.skuActions[0].newValues, previousValue, key);
                        vm.pendingActions.skuActions[sku][key].swatch = swatch;
                    }

                    if (Object.keys(vm.pendingActions.warnings[sku]).length === 0)
                        delete vm.pendingActions.warnings[sku];
                    if (Object.keys(vm.pendingActions.errors[sku]).length === 0)
                        delete vm.pendingActions.errors[sku];

                }, function(error){
                    if (!vm.pendingActions.skuActions[sku])
                        vm.pendingActions.skuActions[sku] = {};
                    if (!vm.pendingActions.warnings[sku])
                        vm.pendingActions.warnings[sku] = {};
                    if (!vm.pendingActions.errors[sku])
                        vm.pendingActions.errors[sku] = {};

                    delete vm.pendingActions.warnings[sku][key];
                    if (Object.keys(vm.pendingActions.warnings[sku]).length === 0)
                        delete vm.pendingActions.warnings[sku];

                    vm.pendingActions.errors[sku][key] = ["No Server Response."];
                    vm.pendingActions.skuActions[sku][key] = {};
                });
        }

        function apply(key, newValue){
            if(!key || newValue === "" || newValue == null)
                return;

            var dateKey = Date.now();
            var skuActionsArray = [];

            if(!vm.massActions.skuActions[key]) {
                vm.massActions.skuActions[key] = {};
                vm.massActions.skuActions[key].dictionary = {};
                vm.massActions.skuActions[key].changes = {};
            }

            angular.forEach(vm.sortedVariants, function(swatch){
                angular.forEach(swatch.variants, function(variant){
                   if(variant.check) {
                       addSkuActions(variant.sku, key);
                       if(key == 'clearancePercent')
                           variant.clearanceModel = '';
                       if(key == 'salePercent')
                           variant.saleModel = '';
                       if(key == 'gruppoPercent')
                           variant.gruppoModel = '';
                       if(key == 'flashPercent')
                           variant.flashModel = '';
                   }
                });
            });

            if(skuActionsArray.length > 0)
                validateChanges();
            else
                delete vm.massActions.skuActions[key];


            function addSkuActions(sku, key){
                //remove from previous massActions[key][date]
                deleteMassActionElement(sku, key);

                //remove from pendingAction
                if(key === 'clearancePercent')
                    deletePendingAction(sku, 'clearancePrice');
                if(key === 'salePercent')
                    deletePendingAction(sku, 'salePrice');
                if(key === 'gruppoPercent')
                    deletePendingAction(sku, 'gruppoPrice');
                if(key === 'flashPercent')
                    deletePendingAction(sku, 'flashPrice');

                vm.massActions.skuActions[key].dictionary[sku] = dateKey;

                var skuAction = {};

                skuAction.sku = sku;
                skuAction.newValues = {};
                skuAction.newValues[key] = newValue;

                skuActionsArray.push(skuAction);
            }

            function validateChanges(){
                variantService.validateFieldChange(skuActionsArray)
                    .then(function(result){
                        vm.massActions.skuActions[key].changes[dateKey] = {};
                        vm.massActions.skuActions[key].changes[dateKey].newValue = newValue;
                        vm.massActions.skuActions[key].changes[dateKey].errors = {};
                        vm.massActions.skuActions[key].changes[dateKey].warnings = {};
                        vm.massActions.skuActions[key].changes[dateKey].skus = [];

                        angular.forEach(result.skuActions, function(skuAction){
                            vm.massActions.skuActions[key].changes[dateKey].skus.push(skuAction.sku);
                        });
                        angular.forEach(result.warnings, function(warning){
                            var warningArray = warning.split(" ");
                            var sku = warningArray[0];

                            vm.massActions.skuActions[key].changes[dateKey].warnings[sku] = vm.massActions.skuActions[key].changes[dateKey].warnings[sku] || [];

                            vm.massActions.skuActions[key].changes[dateKey].warnings[sku].push(warning);
                        });
                        angular.forEach(result.errors, function(error){
                            var errorArray = error.split(" ");
                            var sku = errorArray[0];

                            vm.massActions.skuActions[key].changes[dateKey].errors[sku] = vm.massActions.skuActions[key].changes[dateKey].errors[sku] || [];

                            vm.massActions.skuActions[key].changes[dateKey].errors[sku].push(error);
                        });
                        vm.massActions.errors += Object.keys(vm.massActions.skuActions[key].changes[dateKey].errors).length;

                    }, function(error){

                    });
            }

        }

        function toErrorString(errorObj){
            var errString = '<br/>';
            angular.forEach(errorObj, function(sku){
                angular.forEach(sku, function(error){
                    errString+= error+"<br/><br/>";
                });
            });
            return errString;
        }

        function deletePendingAction(sku, key, swatch){
            //reset the view/model
            if(swatch)
                angular.forEach(swatch.variants, function(variant){
                    if (variant.sku === sku)
                     switch(key) {
                         case 'wholesalePrice':
                             variant.wholesaleModel = variant.offers[0].wholesalePrice;
                             break;
                         case 'regularPrice':
                             variant.regualarModel = variant.offers[0].price;
                             break;
                         case 'salePrice':
                             variant.saleModel = variant.offers[0].salePrice;
                             break;
                         case 'clearancePrice':
                             variant.clearanceModel = variant.offers[0].clearancePrice;
                             break;
                         case 'gruppoPrice':
                             variant.gruppoModel = variant.offers[0].gruppoPrice;
                             break;
                         case 'flashPrice':
                             variant.flashModel = variant.offers[0].flashPrice;
                             break;
                         case 'catalogAssignments':
                             variant.catalogModel = [];
                             angular.forEach(variant.catalogAssignments, function(catalog){
                                 variant.catalogModel.push(catalog);
                             });
                             break;
                         case 'season':
                             variant.seasonModel = variant.season;
                             break;
                         case 'year':
                             variant.yearModel = variant.year;
                             break;
                         case 'selloutCode':
                             variant.selloutModel = variant.offers[0].selloutCodeId;
                             break;
                     }
                });

            if (vm.pendingActions.skuActions[sku]) {
                if (Object.keys(vm.pendingActions.skuActions[sku]).length !== 0) {
                    delete vm.pendingActions.skuActions[sku][key];
                    if (vm.pendingActions.errors[sku]) {
                        delete vm.pendingActions.errors[sku][key];
                        if (Object.keys(vm.pendingActions.errors[sku]).length === 0)
                            delete vm.pendingActions.errors[sku];
                    }
                    if (vm.pendingActions.warnings[sku]) {
                        delete vm.pendingActions.warnings[sku][key];
                        if (Object.keys(vm.pendingActions.warnings[sku]).length === 0)
                            delete vm.pendingActions.warnings[sku];
                    }
                }

                if (Object.keys(vm.pendingActions.skuActions[sku]).length === 0)
                    delete vm.pendingActions.skuActions[sku];
            }
        }

        function deleteMassAction(key, dateKey) {
            //remove errors from total number of errors
            vm.massActions.errors -= Object.keys(vm.massActions.skuActions[key].changes[dateKey].errors).length;
            //delete the specific mass change and clean the dictionary
            delete vm.massActions.skuActions[key].changes[dateKey];
            angular.forEach(vm.massActions.skuActions[key].dictionary, function(deletedKey, sku){
                if(deletedKey == dateKey)
                    delete vm.massActions.skuActions[key].dictionary[sku];
            });

            //if there are no more changes within the field change, delete it
            if(Object.keys(vm.massActions.skuActions[key].dictionary).length === 0)
                delete vm.massActions.skuActions[key];
        }

        function deleteMassActionElement(sku, key) {
            if(vm.massActions.skuActions[key])
                var date = vm.massActions.skuActions[key].dictionary[sku];
            if(date) {
                if(vm.massActions.skuActions[key].changes[date].warnings)
                    delete vm.massActions.skuActions[key].changes[date].warnings[sku];
                if(vm.massActions.skuActions[key].changes[date].errors) {
                    if(vm.massActions.skuActions[key].changes[date].errors[sku]) {
                        vm.massActions.errors -= 1;
                        delete vm.massActions.skuActions[key].changes[date].errors[sku];
                    }
                }
                vm.massActions.skuActions[key].changes[date].skus.splice(vm.massActions.skuActions[key].changes[date].skus.indexOf(sku), 1);
                if(vm.massActions.skuActions[key].changes[date].skus.length === 0)
                    delete vm.massActions.skuActions[key].changes[date];
                delete vm.massActions.skuActions[key].dictionary[sku];
                if(Object.keys(vm.massActions.skuActions[key].dictionary).length === 0)
                    delete vm.massActions.skuActions[key];
            }
        }

    }

})();