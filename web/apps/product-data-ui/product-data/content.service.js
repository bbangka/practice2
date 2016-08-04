(function(){
    angular
        .module("product-data-ui")
        .factory("contentService", contentService);


    function contentService($resource) {
        var service = {
            copyResource: $resource('content/print_content/style_list/:style.json'),
            getProduct: getProduct
        };

        return service;

        function getProduct(style) {
            return service.copyResource.get({style: style}).$promise;
        }
    }
})();