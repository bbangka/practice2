(function(){
    angular
        .module("product-data-ui")
        .factory("contentIntegrationService", contentIntegrationService);


    function contentIntegrationService($resource) {
        var service = {
            feedbackResource: $resource('content-integration/v1/activities/feedback/tasks'),
            report: report
        };

        return service;

        function report(data) {
            return service.feedbackResource.save({}, data).$promise;
        }
    }
})();