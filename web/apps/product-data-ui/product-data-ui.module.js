(function() {
    'use strict';

    angular
        .module('product-data-ui', getImports());

    function getImports() {
        var imports = [];

        imports.push('ngRoute');
        imports.push('ngResource');
        imports.push('ngCookies');
        imports.push('ngSanitize');
        imports.push('ui.bootstrap');
        imports.push('fbe.auth');
        imports.push('fbe.ui');
        return imports;
    }




})();
