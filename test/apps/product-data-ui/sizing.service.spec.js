describe('sizingService', function () {

    var sizingService, $q, $scope;
    var deferred;

    beforeEach(function() {module('product-data-ui') });
    beforeEach(inject(function ($injector) {
        sizingService = $injector.get('sizingService');
        $q = $injector.get('$q');
        $scope = $injector.get('$rootScope').$new();
    }));

    beforeEach(function() {
        deferred = $q.defer();
        deferred.$promise = deferred.promise;
    });


    describe('initialState', function() {
        it('should have a defined variable "getSizing"', function() {
            expect(sizingService.getSizing).toBeDefined();
        });

        it('should have a defined function "getSizing"', function() {
            expect(sizingService.getSizing).toEqual(jasmine.any(Function));
        });

        it('should have a defined variable "sizingResource"', function() {
            expect(sizingService.sizingResource).toBeDefined();
        });


    });

    describe('getSizing', function(){
        var returned;
        var styleObj  = {style: "TNF0115"};
        var sizingObj = { "TNF0115-A-B": 3};
        beforeEach(function(){
            spyOn(sizingService.sizingResource, 'query').andReturn(deferred);
            returned = sizingService.getSizing(styleObj.style);
        });
        it('should call query', function() {
            expect(sizingService.sizingResource.query).toHaveBeenCalledWith(styleObj);
        });

        it('should return a sizing object', function() {
            returned.then(function(resultObj){
                expect(resultObj).toBe(sizingObj)
            });
        });

    });

});