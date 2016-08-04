(function(){
    'use strict';
    describe('Index Controller',function(){

        var createController, $rootScope, merchService, $scope, $q, $location;


        beforeEach(function() {module('product-data-ui') });

        beforeEach(inject(function ($injector) {
            var $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            merchService = $injector.get('merchService');
            $q = $injector.get('$q');
            $scope = $injector.get('$rootScope').$new();
            $location = {search: function(){return $location}, path:function(){return $location}};
            createController = function(){
                return $controller(
                    'SearchController',
                    {
                        $location: $location,
                        $scope: $scope
                    }
                );
            };
        }));



        describe('exposed methods', function () {
            var controller;

            beforeEach(function () {
                controller = createController();
            });

            it('should have a method "searchClick"', function () {
                expect(controller.searchClick).toBeDefined();
                expect(controller.searchClick).toEqual(jasmine.any(Function));
            });

        });

        describe('searchClick',function(){

            var controller, userInput, brands, brandFilter;

            var brandDeferred;

            var resolveBrandsPromise = function (withThis) {
                brandDeferred.resolve(withThis);
                $scope.$apply();
            };

            beforeEach(function () {
                brands = {"Nike":100, "100%": 200};
                userInput="Shoes";
                brandFilter = "Nike";
                brandDeferred = $q.defer();
                spyOn(merchService, 'getBrands').andReturn(brandDeferred.promise);
                spyOn($location, 'search').andCallThrough();
                spyOn($location, 'path').andCallThrough();
                controller = createController();
                resolveBrandsPromise(brands);
            });
            it('shoud make array of brands', function(){
                expect(controller.brands).toEqual(["Nike", "100%"]);
            });

            it('should call searchService.search', function(){
                controller.brandFilter = brandFilter;
                controller.searchClick(userInput);
                expect($location.search).toHaveBeenCalledWith('search', userInput);
                expect($location.search).toHaveBeenCalledWith('brandId', 100);
            });

        });

    });
})();