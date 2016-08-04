(function() {
    'use strict';


    angular
        .module('product-data-ui')
        .directive('notes', notes);

    function notes(){
        var directive =
        {
            restrict:'E',
            templateUrl:'product-data-ui/product-data/directives/notes.template.jade'

        };

        return directive;
    }

})();
