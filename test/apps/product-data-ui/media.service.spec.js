(function() {
    describe('mediaService', function () {

        var mediaService, imagesFromMedia, sortedObj, $q, $scope, deferred;

        beforeEach(function () {
            module('product-data-ui')
        });

        beforeEach(inject(function ($injector) {
            mediaService = $injector.get('mediaService');
            $q = $injector.get('$q');
            $scope = $injector.get('$rootScope').$new();
        }));

        beforeEach(function() {
            deferred = $q.defer();
            deferred.$promise = deferred.promise;
        });
        beforeEach(function () {
            imagesFromMedia = [{
                identifier: "b", mainImage: {urls: {small: "/abc"}}
            },
            {
                identifier: "c", mainImage: {urls: {small: "/abc1"}}
            },
            {
                identifier: "d", mainImage: {urls: {small: "/abc2"}}
            },
            {
                identifier: "e", mainImage: {urls: {small: "/abc3"}}
            }];

            sortedObj = {
                b: "/abc",
                c: "/abc1",
                d: "/abc2",
                e: "/abc3"
            };

        });

        describe('exposed methods', function () {


            it('should have a method "getImages"', function () {
                expect(mediaService.getImages).toBeDefined();
                expect(mediaService.getImages).toEqual(jasmine.any(Function));
            });

            it('should have a method "getImages"', function () {
                expect(mediaService.isSkuLevel).toBeDefined();
                expect(mediaService.isSkuLevel).toEqual(jasmine.any(Function));
            });

        });

        describe('getImages', function(){
            var style ="TNF0115";
            var returned;

            var resolveMediaPromise = function (withThis) {
                deferred.resolve(withThis);
                $scope.$apply();
            };

            beforeEach(function(){
                deferred = $q.defer();
                deferred.$promise = deferred.promise;
                spyOn(mediaService.mediaResource, 'query').andReturn(deferred);
            });

            it('should call query', function() {
                returned = mediaService.getImages(style);
                resolveMediaPromise({});
                expect(mediaService.mediaResource.query).toHaveBeenCalledWith({style: "TNF0115"});
            });

        });

        describe('isSkuLevel', function () {

            var mediaDeferred, style, returned;


            var resolveMediaPromise = function (withThis) {
                mediaDeferred.resolve(withThis);
                $scope.$apply();
            };

            beforeEach(function(){
                style = "TNF0115";
                mediaDeferred = $q.defer();
                mediaDeferred.$promise = mediaDeferred.promise;
                spyOn(mediaService.swatchResource, 'get').andReturn(mediaDeferred);
                returned = mediaService.isSkuLevel(style);
                resolveMediaPromise({content:[]});
            });

            it('should call isSkuLevel with style', function () {
                expect(mediaService.swatchResource.get).toHaveBeenCalledWith(
                    {
                        style: style,
                        skulevel: true,
                        "page.page": 1,
                        "page.size": 10
                    });
            });

            it('should return isSkuLevel', function(){
                returned.then(function(isSkuLevel){
                    expect(isSkuLevel).toBe(false);
                });
            });
        });
    });
})();