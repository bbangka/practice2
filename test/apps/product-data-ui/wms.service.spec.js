describe('wmsService', function () {

    var wmsService, $q, $scope;
    var deferred;

    beforeEach(function() {module('product-data-ui') });
    beforeEach(inject(function ($injector) {
        wmsService = $injector.get('wmsService');
        $q = $injector.get('$q');
        $scope = $injector.get('$rootScope').$new();
    }));

    beforeEach(function() {
        deferred = $q.defer();
        deferred.$promise = deferred.promise;
    });


    describe('initialState', function() {
        it('should have a defined variable "getQOH"', function() {
            expect(wmsService.getQOH).toBeDefined();
        });

        it('should have a defined function "getQOH"', function() {
            expect(wmsService.getQOH).toEqual(jasmine.any(Function));
        });

        it('should have a defined variable "wmsResource"', function() {
            expect(wmsService.wmsResource).toBeDefined();
        });


    });

    describe('getQOH', function(){
        var returned;
        var variants = [{sku:"TNF0115-A-B"}];
        var qoh = [{sku: "TNF0115-A-B", quantity: 3}];
        beforeEach(function(){
            spyOn(wmsService.wmsResource, 'query').andReturn(deferred);
            returned = wmsService.getQOH(variants);
        });
        it('should call query', function() {
            expect(wmsService.wmsResource.query).toHaveBeenCalledWith({skus: "TNF0115-A-B", status : "on_hand"});
        });

        it('should return a qoh object', function() {
            returned.then(function(qoh){
                expect(qoh).toBe({"TNF0115-A-B": 3})
            });
        });

    });

});