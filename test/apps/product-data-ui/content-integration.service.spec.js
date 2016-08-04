describe('ContentIntegrationService', function () {

    var contentIntegrationService, $q, $scope;
    var deferred;

    beforeEach(function() {module('product-data-ui') });
    beforeEach(inject(function ($injector) {
        contentIntegrationService = $injector.get('contentIntegrationService');
        $q = $injector.get('$q');
        $scope = $injector.get('$rootScope').$new();
    }));

    beforeEach(function() {
        deferred = $q.defer();
        deferred.$promise = deferred.promise;
    });

    describe('initialState', function() {
        it('should have a defined variable "report"', function() {
            expect(contentIntegrationService.report).toBeDefined();
            expect(contentIntegrationService.report).toEqual(jasmine.any(Function));
        });

        it('should have a defined variable "feedbackResource"', function() {
            expect(contentIntegrationService.feedbackResource).toBeDefined();
        });
    });

    describe('report', function(){
        var data={
            user: 'adrinkwater',
            style: 'TNF0115',
            skuPart: 'BNBL',
            comment: 'test',
            imageUrl: 'http://www.backcountry.com/images/items/small/TNF/TNF0115/BNBL.jpg'
        };
        beforeEach(function(){
            spyOn(contentIntegrationService.feedbackResource, 'save').andReturn(deferred);
            contentIntegrationService.report(data);
        });
        it('should call feedbackResource', function() {
            expect(contentIntegrationService.feedbackResource.save).toHaveBeenCalledWith({}, data);
        });
    });

});