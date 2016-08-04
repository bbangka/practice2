(function(){
    'use strict';
    describe('Modal Controller',function(){


        var createController, $scope, modalInstance, mockData, mockImages, mockSwatch;

        beforeEach(function() {module('product-data-ui') });

        beforeEach(inject(function ($injector) {
            var $controller = $injector.get('$controller');
            $scope = $injector.get('$rootScope').$new();

            modalInstance = {
                close: jasmine.createSpy('modalInstance.close'),
                dismiss: jasmine.createSpy('modalInstance.dismiss'),
                result: {
                    then: jasmine.createSpy('modalInstance.result.then')
                }
            };

            mockData = {
                skuPart: 'A'
            };

            mockImages = [{
                urls: {
                    small: '/A'
                }
            }];

            mockSwatch = 'Red';

            createController = function(){
                return $controller(
                    'ModalController',
                    {
                        $scope: $scope,
                        $modalInstance: modalInstance,
                        data: mockData,
                        images: mockImages,
                        swatch: mockSwatch
                    }
                );
            };
        }));

        describe('Exposed variables', function(){
            var controller;
            beforeEach(function() {
                controller = createController();
            });

            it('should have a variable "comment"', function() {
                expect(controller.comment).toBeDefined();
                expect(controller.comment).toEqual('');
            });

            it('should have a variable "swatch"', function() {
                expect(controller.swatch).toBeDefined();
                expect(controller.swatch).toEqual('Red');
            });

            it('should have a variable "images"', function() {
                expect(controller.images).toBeDefined();
                expect(controller.images).toEqual(mockImages);
            });

            it('should have a variable "currentImage"', function() {
                expect(controller.currentImage).toBeDefined();
                expect(controller.currentImage).toEqual(mockImages[0]);
            });

        });

        describe('exposed methods', function () {
            var controller;

            beforeEach(function () {
                controller = createController();
            });

            it('should have a method "report"', function () {
                expect(controller.report).toBeDefined();
                expect(controller.report).toEqual(jasmine.any(Function));
            });

            it('should have a method "cancel"', function () {
                expect(controller.cancel).toBeDefined();
                expect(controller.cancel).toEqual(jasmine.any(Function));
            });

            it('should have a method "changeCurrentImage"', function () {
                expect(controller.changeCurrentImage).toBeDefined();
                expect(controller.changeCurrentImage).toEqual(jasmine.any(Function));
            });

            it('should have a method "getUrl"', function () {
                expect(controller.getUrl).toBeDefined();
                expect(controller.getUrl).toEqual(jasmine.any(Function));
            });

        });

        describe('report', function(){
            var controller;

            beforeEach(function(){
                controller = createController();
            });

            it('should not close modal if description is empty', function(){
                controller.report('');
                expect(modalInstance.close).not.toHaveBeenCalled();
            });

            it('should close modal if description is not empty', function(){
                mockData.description = 'bad image';
                controller.report('bad image');
                expect(modalInstance.close).toHaveBeenCalledWith(mockData);
            });

        });

        describe('cancel', function(){
            var controller;

            beforeEach(function(){
                controller = createController();
            });

            it('should dismiss modal', function(){
                controller.cancel();
                expect(modalInstance.dismiss).toHaveBeenCalled();
            });
        });

        describe('changeCurrentImage', function(){
            var changedImage = {urls: {}, detailImages: {}};
            var controller;
            it('should change current image', function(){
                controller = createController();
                controller.changeCurrentImage(changedImage);
                expect(controller.currentImage).toEqual(changedImage);
            });
        });

        describe('getUrl', function(){
            var controller, url;
            var identifier = '/A';
            beforeEach(function(){
                controller = createController();
            });
            it('should return a url', function(){
                url = controller.getUrl(identifier);
                expect(url).toEqual("http://www.backcountry.com/A");
            });
        });

    });
})();