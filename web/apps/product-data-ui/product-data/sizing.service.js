(function(){
    angular
        .module("product-data-ui")
        .factory("sizingService", sizingService);


    function sizingService($resource, $q) {
        var service = {
            sizingResource: $resource('content-sizing/variant-sizes'),
            getSizing: getSizing
        };

        return service;


        function getSizing(style) {
            var deferred = $q.defer();
            service.sizingResource.query({style: style}).$promise
                .then(function(result){
                    var sizingObj = getSizingObject(result);
                    deferred.resolve(sizingObj);
            });

            return deferred.promise;
        }

        function getSizingObject(sizingArray) {
            var sizingObj= {};
            for (var i = 0; i < sizingArray.length; i++) {
                var sku = sizingArray[i].sku;
                sizingObj[sku] = Number(sizingArray[i].size.position);
            }
            return sizingObj;
        }
    }
})();