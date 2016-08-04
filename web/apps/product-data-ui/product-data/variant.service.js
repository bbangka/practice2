(function(){
    angular
        .module("product-data-ui")
        .factory("variantService", variantService);


    function variantService($resource) {
        var service = {
            matValidationResource: $resource('mat/v1/validate'),
            matSaveResource: $resource('mat/v1/merch-actions'),
            validateFieldChange: validateFieldChange,
            savePriceChange: savePriceChange,
            sortVariants: sortVariants,
            convertToNumber: convertToNumber
        };

        return service;

        function savePriceChange(merchAction) {
            return service.matSaveResource
                .save({}, merchAction).$promise;
        }

        function validateFieldChange(skuActionsArray) {
            return service.matValidationResource
                .save({}, skuActionsArray).$promise;
        }
        
        function sortVariants(product, qohs, vendorSkus, sizing) {
            var sortedVariants = {};
            var axisToUse, offAxis;

            if(product.isSkuLevel){
                axisToUse = "sku";
                offAxis = "sku";
            } else if(product.axis2.swatch === false) {
                axisToUse = "axis1Value";
                offAxis = "axis2Value";
            } else if (product.axis1.swatch === false && product.axis2.swatch === true){
                axisToUse = "axis2Value";
                offAxis = "axis1Value";
            }

            angular.forEach(product.variants, function(variant){

                var axisValue = variant[axisToUse];

                if (!sortedVariants[axisValue]){
                    sortedVariants[axisValue] = {variants:[], qoh : 0};
                    sortedVariants[axisValue].identifier = getIdentifier(variant,axisToUse);
                    sortedVariants[axisValue].swatch = variant[axisToUse];
                }

                init(variant);
                variant.qoh = (qohs[variant.sku]) ? qohs[variant.sku] : 0;
                variant.vendorSku = (vendorSkus[variant.sku]) ? vendorSkus[variant.sku] : "";
                variant.sizing = (sizing[variant.sku]) ? sizing[variant.sku] : variant[offAxis];
                sortedVariants[axisValue].qoh += variant.qoh;

                sortedVariants[axisValue].variants.push(variant);

                sortedVariants[axisValue].isOpen = false;

                filterPrices(sortedVariants[axisValue],variant);

                filterSeasons(sortedVariants[axisValue],variant);

                filterSoCode(sortedVariants[axisValue],variant);

                filterCatalogs(sortedVariants[axisValue], variant);

            });


            var filtered= [];
            angular.forEach(sortedVariants, function(item){
                filtered.push(item);
            });
            return filtered;

        }

        function init(variant){
            if(variant.offers[0].selloutCodeId == "") {
                variant.offers[0].selloutCodeId = "0";
            }
            variant.catalogModel = [];
            angular.forEach(variant.catalogAssignments, function(catalog){
               variant.catalogModel.push(catalog);
            });

            variant.selloutModel = variant.offers[0].selloutCodeId;
            variant.seasonModel = variant.season;
            variant.yearModel = variant.year;
            variant.wholesaleModel = variant.offers[0].wholesalePrice;
            variant.regularModel = variant.offers[0].price;
            variant.saleModel = variant.offers[0].salePrice;
            variant.clearanceModel=variant.offers[0].clearancePrice;
            variant.gruppoModel = variant.offers[0].gruppoPrice;
            variant.flashModel = variant.offers[0].flashPrice;
        }

        function getIdentifier(variant,axisToUse){
            var id="";
            var skuParts = variant.sku.split('-');
            if (axisToUse === "axis1Value") {
                id = skuParts[1];
            }
            else if (axisToUse === "axis2Value") {
                id = skuParts[2];
            }
            else {
                id = variant.sku;
            }
            return id;
        }

        function filterSoCode(swatch,variant){
            if(!swatch.soCode){
                swatch.soCode = [];
            }
            if(swatch.soCode.indexOf(variant.offers[0].selloutCodeId) == -1){
                swatch.soCode.push(variant.offers[0].selloutCodeId);
            }
        }

        function filterCatalogs(swatch,variant){
            if(!swatch.catalogs){
                swatch.catalogs = [];
            }
            angular.forEach(variant.catalogAssignments, function(catalogElement){
                if(swatch.catalogs.indexOf(catalogElement) == -1){
                    swatch.catalogs.push(catalogElement);
                }
            });
        }


        function filterSeasons(swatch,variant){
            if(!swatch.seasons){
                swatch.seasons = [];
            }
            var seasonYear = variant.season + " - " + variant.year;
            if(swatch.seasons.indexOf(seasonYear) == -1){
                swatch.seasons.push(seasonYear);
            }


            if(!swatch.mostRecentSeason){
                swatch.mostRecentSeason= convertToNumber(seasonYear);
            }else if (swatch.mostRecentSeason < convertToNumber(seasonYear) ) {
                    swatch.mostRecentSeason = convertToNumber(seasonYear);
                }


        }

        function convertToNumber(seasonYear){
            var timeArray = seasonYear.split(' ');
            var seasons = ["SS0","SS1","SS2", "FW0","FW1","FW2","COR"];
            return Number(timeArray[2] + seasons.indexOf(timeArray[0]));
        }

        function filterPrices(swatch,variant){
            if(variant.offers[0].price !== null) {
                if (swatch.minPrice === undefined || swatch.minPrice > variant.offers[0].price) {
                    swatch.minPrice = variant.offers[0].price;
                }
                if (swatch.maxPrice === undefined || swatch.maxPrice < variant.offers[0].price) {
                    swatch.maxPrice = variant.offers[0].price;
                }
            }

            if(variant.offers[0].wholesalePrice !== null) {
                if (swatch.minWSPrice === undefined || swatch.minWSPrice > variant.offers[0].wholesalePrice) {
                    swatch.minWSPrice = variant.offers[0].wholesalePrice;
                }
                if (swatch.maxWSPrice === undefined || swatch.maxWSPrice < variant.offers[0].wholesalePrice) {
                    swatch.maxWSPrice = variant.offers[0].wholesalePrice;
                }
            }

            if(variant.offers[0].salePrice !== null) {
                if (swatch.minSPrice === undefined || swatch.minSPrice > variant.offers[0].salePrice) {
                    swatch.minSPrice = variant.offers[0].salePrice;
                }
                if (swatch.maxSPrice === undefined || swatch.maxSPrice < variant.offers[0].salePrice) {
                    swatch.maxSPrice = variant.offers[0].salePrice;
                }
            }

            if(variant.offers[0].clearancePrice !== null) {
                if (swatch.minCPrice === undefined || swatch.minCPrice > variant.offers[0].clearancePrice) {
                    swatch.minCPrice = variant.offers[0].clearancePrice;
                }
                if (swatch.maxCPrice === undefined || swatch.maxCPrice < variant.offers[0].clearancePrice) {
                    swatch.maxCPrice = variant.offers[0].clearancePrice;
                }
            }

            if(variant.offers[0].gruppoPrice !== null) {
                if (swatch.minGPrice === undefined || swatch.minGPrice > variant.offers[0].gruppoPrice) {
                    swatch.minGPrice = variant.offers[0].gruppoPrice;
                }
                if (swatch.maxGPrice === undefined || swatch.maxGPrice < variant.offers[0].gruppoPrice) {
                    swatch.maxGPrice = variant.offers[0].gruppoPrice;
                }
            }

            if(variant.offers[0].flashPrice !== null) {
                if (swatch.minFPrice === undefined || swatch.minFPrice > variant.offers[0].flashPrice) {
                    swatch.minFPrice = variant.offers[0].flashPrice;
                }
                if (swatch.maxFPrice === undefined || swatch.maxFPrice < variant.offers[0].flashPrice) {
                    swatch.maxFPrice = variant.offers[0].flashPrice;
                }
            }
        }
    }


})();