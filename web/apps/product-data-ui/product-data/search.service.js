(function(){
    angular
        .module("product-data-ui")
        .factory("searchService", searchService);

        function searchService($resource) {
            var service = {
                searchResource: $resource('search'),
                search: search
            };

            return service;

            function search(searchText, brandId) {
                return service.searchResource.query({search: searchText, brandId: brandId}).$promise;
            }
        }
})();