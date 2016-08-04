(function(){
    angular
        .module("product-data-ui")
        .factory("wmsService", wmsService);


    function wmsService($resource, $q) {
        var service = {
            wmsResource: $resource('wms/v1/inventory_summary/:sku'),
            getQOH: getQOH

        };

        return service;


        function getQOH(variants){
            var skus = [];
            var qohDeferred = $q.defer();

            var i = 0;
            angular.forEach(variants, function(variant) {
                if (i%90 == 0) {
                    skus.push([]);
                }
                skus[skus.length-1].push(variant.sku);
                i++;

            });

            var tasks = [];

            angular.forEach(skus, function(sku) {
                tasks.push(
                    service.wmsResource.query({skus: sku.toString(), status : "on_hand"}).$promise
                        .then( function(data) {
                            return data;
                        }, function(err){
                            console.log(err);
                        })
                );
            }, tasks);
            $q.all(tasks)
                .then(function(results){
                    var qohObj = getQOHObject(results);
                    qohDeferred.resolve(qohObj);
                });
            return qohDeferred.promise;
        }

        function getQOHObject(results) {
            var qoh = {};
            angular.forEach(results, function(result) {
                angular.forEach(result, function(variant) {
                    qoh[variant.sku] = variant.quantity;
                })
            });
            return qoh;
        }


    }

})();