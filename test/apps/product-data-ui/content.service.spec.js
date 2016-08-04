describe('ContentService', function () {

    var contentService, $q, $scope;
    var deferred;

    beforeEach(function() {module('product-data-ui') });
    beforeEach(inject(function ($injector) {
        contentService = $injector.get('contentService');
        $q = $injector.get('$q');
        $scope = $injector.get('$rootScope').$new();
    }));

    beforeEach(function() {
        deferred = $q.defer();
        deferred.$promise = deferred.promise;
    });

    describe('initialState', function() {
        it('should have a defined variable "getProduct"', function() {
            expect(contentService.getProduct).toBeDefined();
            expect(contentService.getProduct).toEqual(jasmine.any(Function));
        });

        it('should have a defined variable "copyResource"', function() {
            expect(contentService.copyResource).toBeDefined();
        });
    });

    describe('getProduct', function(){
        var style={style:"TNF0115"};
        beforeEach(function(){
            spyOn(contentService.copyResource, 'get').andReturn(deferred);
            contentService.getProduct(style);
        });
        it('should call get', function() {
            expect(contentService.copyResource.get).toHaveBeenCalled();
        });
    });

});