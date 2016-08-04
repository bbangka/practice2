(function() {
    'use strict';

    angular
        .module('product-data-ui')
        .controller('ModalController', ModalController);


    function ModalController($modalInstance, data, images, swatch) {
        var vm = this;

        vm.swatch = swatch;
        vm.comment = '';
        vm.images = images;
        vm.currentImage = images[0];

        vm.report = report;
        vm.cancel = cancel;
        vm.changeCurrentImage = changeCurrentImage;
        vm.getUrl = getUrl;

        function report (description) {
            if(description) {
                data.comment = vm.comment;
                data.imageUrl = vm.getUrl(vm.currentImage.urls.small);
                $modalInstance.close(data);
            }
        }

        function cancel () {
            $modalInstance.dismiss();
        }

        function changeCurrentImage (image) {
            vm.currentImage = image;
        }

        function getUrl (identifier){
            return "http://www.backcountry.com"+identifier;
        }

    }

})();