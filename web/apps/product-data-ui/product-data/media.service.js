(function(){
    angular
        .module("product-data-ui")
        .factory("mediaService", mediaService);


    function mediaService($resource, $q) {

        var service = {
            mediaResource: $resource('media/v1/images'),
            swatchResource: $resource('media/v1/swatches'),
            getImages: getImages,
            isSkuLevel: isSkuLevel
        };

        return service;

        function getImageObject(imageArray) {
            var imageObj= {};

            for (var i = 0; i < imageArray.length; i++) {
                if(!imageObj[imageArray[i].identifier])
                    imageObj[imageArray[i].identifier] = {};
                imageObj[imageArray[i].identifier].urls = imageArray[i].mainImage.urls;
                imageObj[imageArray[i].identifier].detailImages = imageArray[i].detailImages;
            }
            return imageObj;
        }

        function getImages(style){
            var deferred = $q.defer();
            service.mediaResource.query({style: style}).$promise
                .then(function(result){
                    var images = getImageObject(result);
                    deferred.resolve(images);
                }, function(error){
                    deferred.resolve({});
                });
            return deferred.promise;
        }


        function isSkuLevel(style){
            var deferred = $q.defer();

            service.swatchResource.get({
                style: style,
                skulevel: true,
                "page.page": 1,
                "page.size": 10
            }).$promise
                .then(function(result){
                    var skuLevel = result.content.length > 0;
                    deferred.resolve(skuLevel);
                });

            return deferred.promise;
        }


    }

})();