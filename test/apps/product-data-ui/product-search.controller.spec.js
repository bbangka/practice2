(function(){
    'use strict';
    describe('Product Search Controller',function(){

        var createController, $rootScope, searchService, $scope, $q, $location;

        beforeEach(function() {module('product-data-ui') });

        beforeEach(inject(function ($injector) {
            var $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            searchService = $injector.get('searchService');
            $q = $injector.get('$q');
            $scope = $injector.get('$rootScope').$new();
            $location = {search: function(){return $location}, path:function(){return $location}};
            createController = function(){
                return $controller(
                    'ProductSearchController',
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

            it('should have a method "search"', function () {
                expect(controller.search).toBeDefined();
                expect(controller.search).toEqual(jasmine.any(Function));
            });

            it('should have a method "productClick"', function () {
                expect(controller.productClick).toBeDefined();
                expect(controller.productClick).toEqual(jasmine.any(Function));
            });
        });

        describe('search',function(){

            var controller, searchResults, userInput;

            var searchDeferred;

            var resolveSearchPromise = function (withThis) {
                searchDeferred.resolve(withThis);
                $scope.$apply();
            };

            beforeEach(function () {
                userInput="TNF0115";
                searchResults = [{style:"TNF0115"}];
                searchDeferred = $q.defer();
                spyOn(searchService, 'search').andReturn(searchDeferred.promise);
                spyOn($location, 'search').andCallThrough();
                spyOn($location, 'path').andCallThrough();
                controller = createController();
            });

            it('should call searchService.search', function(){
                controller.search(userInput);
                expect($location.search).toHaveBeenCalledWith('search', 'TNF0115');
                expect(controller.searchResults).toEqual(null);
                expect(controller.loading).toEqual(true);
                resolveSearchPromise(searchResults);
                expect(searchService.search).toHaveBeenCalledWith(userInput, undefined);
                expect(controller.searchResults).toEqual(searchResults);
                expect(controller.loading).toEqual(false);
            });

            it('should call searchService.search with brandFilter', function(){
                controller.search(userInput, 1000);
                expect($location.search).toHaveBeenCalledWith('search', 'TNF0115');
                expect($location.search).toHaveBeenCalledWith('brandId', 1000);
                expect(controller.searchResults).toEqual(null);
                expect(controller.loading).toEqual(true);
                resolveSearchPromise(searchResults);
                expect(searchService.search).toHaveBeenCalledWith(userInput, 1000);
                expect(controller.searchResults).toEqual(searchResults);
                expect(controller.loading).toEqual(false);
            });

            it('should call location properly when productClick is called', function(){
                controller.search(userInput);
                resolveSearchPromise(searchResults);
                controller.productClick(userInput);
                expect($location.path).toHaveBeenCalledWith('/product-data');
                expect($location.search).toHaveBeenCalledWith('search', null);
                expect($location.search).toHaveBeenCalledWith('style', 'TNF0115');
            });
        });

    });
})();