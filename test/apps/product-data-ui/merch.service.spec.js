describe('MerchService', function () {

    var merchService, $q, $scope;
    var deferred;

    beforeEach(function() {module('product-data-ui') });
    beforeEach(inject(function ($injector) {
        merchService = $injector.get('merchService');
        $q = $injector.get('$q');
        $scope = $injector.get('$rootScope').$new();
    }));

    beforeEach(function() {
            deferred = $q.defer();
            deferred.$promise = deferred.promise;
    });

    describe('initialState', function() {
        it('should have a defined variable "getProduct"', function() {
            expect(merchService.getProduct).toBeDefined();
        });

        it('should have a defined function "getProduct"', function() {
            expect(merchService.getProduct).toEqual(jasmine.any(Function));
        });

        it('should have a defined variable "getProductLight"', function() {
            expect(merchService.getProductLight).toBeDefined();
        });

        it('should have a defined function "getProductLight"', function() {
            expect(merchService.getProductLight).toEqual(jasmine.any(Function));
        });

        it('should have a defined variable "getVendorSku"', function() {
            expect(merchService.getVendorSku).toBeDefined();
        });

        it('should have a defined function "getVendorSku"', function() {
            expect(merchService.getVendorSku).toEqual(jasmine.any(Function));
        });

        it('should have a defined variable "merchResource"', function() {
            expect(merchService.merchResource).toBeDefined();
        });

        it('should have a defined variable "vendorResource"', function() {
            expect(merchService.vendorResource).toBeDefined();
        });

        it('should have a defined variable "getSellouts"', function() {
            expect(merchService.getSellouts).toBeDefined();
        });

        it('should have a defined variable "getSeasons"', function() {
            expect(merchService.getSeasons).toBeDefined();
        });

        it('should have a defined variable "getSeasons"', function() {
            expect(merchService.getBrands).toBeDefined();
        });
    });

    describe('getProduct', function(){
        var style={style:"TNF0115"};
        beforeEach(function(){
            spyOn(merchService.merchResource, 'query').andReturn(deferred);
            merchService.getProduct(style);
        });
        it('should call merchResource QUERY', function() {
            expect(merchService.merchResource.query).toHaveBeenCalled();
        });
    });

    describe('getVendorSku', function(){
        var style={style:"TNF0115"}, returned;

        var vendor=[{
            sku: "TNF0115-DJAGY-M",
            vendorSku: "A193-0C5-M"
        }];

        beforeEach(function(){
            spyOn(merchService.vendorResource, 'query').andReturn(deferred);
            returned = merchService.getVendorSku(style);
        });
        it('should call vendorResource QUERY', function() {
            expect(merchService.vendorResource.query).toHaveBeenCalledWith({style: style});
        });

        it('should return a vendor object', function() {
            returned.then(function(vendor){
                expect(vendor).toBe({'TNF0115-DJAGY-M': "A193-0C5-M"})
            });
        });
    });

    describe('getSellouts', function(){
        var returned;
        var selloutCodes = [
            {
                selloutCode: '32',
                title: "Don't allow backorder"
            },
            {
                selloutCode: '20',
                title: "Allow backorder for items on PO"
            }
        ];

        beforeEach(function(){
            spyOn(merchService.sellOutResource, 'query').andReturn(deferred);
            returned = merchService.getSellouts();
        });

        it('should call sellOutResource QUERY', function() {
            expect(merchService.sellOutResource.query).toHaveBeenCalled();
        });

        it('should return a sellout object', function() {
            returned.then(function(vendor){
                expect(vendor).toBe(selloutCodes);
            });
        });
    });

    describe('getSeasons', function(){
        var returned;
        var seasons = [
            {
                season: 'SS1',
                sort: 2
            },
            {
                season: 'SS0',
                sort: 1
            }
        ];

        beforeEach(function(){
            spyOn(merchService.seasonsResource, 'query').andReturn(deferred);
            returned = merchService.getSeasons();
        });

        it('should call seasonsResource QUERY', function() {
            expect(merchService.seasonsResource.query).toHaveBeenCalled();
        });

        it('should return a season object', function() {
            returned.then(function(season){
                expect(season).toBe(seasons);
            });
        });
    });

    describe('getBrands', function(){
        var returned;
        var brands = [
            {
                brandId: 1,
                name: "NF"
            },
            {
                brandId: 2,
                name: "Nike"
            }
        ];

        beforeEach(function(){
            spyOn(merchService.brandResource, 'query').andReturn(deferred);
            returned = merchService.getBrands();
        });

        it('should call seasonsResource QUERY', function() {
            expect(merchService.brandResource.query).toHaveBeenCalled();
        });

        it('should return a season object', function() {
            returned.then(function(brand){
                expect(brand).toBe(brands);
            });
        });
    });

    describe('getCatalogs', function(){
        var returned;
        var catalogs = [
            {
                id: 'bcs',
                title: 'backcountry'
            },
            {
                id: 'dogfunk',
                title: 'dogfunk'
            }
        ];

        beforeEach(function(){
            spyOn(merchService.catalogResource, 'query').andReturn(deferred);
            returned = merchService.getCatalogs();
        });

        it('should call catalogsResource QUERY', function() {
            expect(merchService.catalogResource.query).toHaveBeenCalled();
        });

        it('should return a season object', function() {
            returned.then(function(catalog){
                expect(catalog).toBe(catalogs);
            });
        });
    });

});