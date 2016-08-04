(function() {
    'use strict';

    var request = require('request');
    var yuri = require('yuri');
    var properties = require('../properties').getProperties();

    var q = require('q');

    var self = {};



    exports.doSearch = function(req, res){
        self.apis = properties.apis;
        var promises = [];
        var search = req.query.search.toUpperCase();
        var brandId = req.query.brandId;
        var titlePromise;
        //style search
        promises.push(requestGet(self.apis['merch'], 'products', {styles: search, variant: false}));
        //sku search
        if  (search.length > 7) {
            promises.push(requestGet(self.apis['merch'], 'products', {skus: search, variant: false}));
        }
        promises.push(vendorGet(self.apis['merch'], 'vendor-skus/vendorSku/'+search));
        if(brandId){
            titlePromise = titleGet(self.apis['merch'], 'product-search', {searchString: search, brandIds: brandId, limit:10});
        }
        else{
            titlePromise = titleGet(self.apis['merch'], 'product-search', {searchString: search, limit:10});
        }
        q.any(promises)
            .then(function(data){
                res.send(data);
            }, function(error){
                titlePromise
                    .then(function(data){
                        res.send(data);
                    }, function(error){
                        res.send(error);
                    });
            })
            .catch(function(error){
                res.send(error);
            });
    };

    function titleGet (api, path, queryParams){
        var deferred = q.defer();

        request.get(buildRequest(api, path, queryParams), function(error, response, body) {
            if(error){
                deferred.resolve([]);
            }
            else if(!Array.isArray(body)) {
                deferred.resolve([]);
            }
            else if(body.length > 0){
                var styles = [];
                for (var i = 0; i < body.length; i++) {
                    styles.push(body[i].style);
                }
                requestGet(self.apis['merch'], 'products', {styles: styles.toString(), variant: false})
                    .then(function(product){
                        deferred.resolve(product);
                    }, function(){
                        deferred.resolve([]);
                    });
            }
            else{
                deferred.resolve([]);
            }

        });

        return deferred.promise;
    }

    function vendorGet (api, path){
        var deferred = q.defer();
        request.get(buildRequest(api, path, {}), function(error, response, body) {
            if(error){
                deferred.reject('error');
            }
            else if(!Array.isArray(body)) {
                deferred.reject('not an array');
            }
            else if(body.length > 0){
                var sku = body[0].sku;
                requestGet(self.apis['merch'], 'products', {skus: sku, variant: false})
                    .then(function(product){
                        deferred.resolve(product);
                    }, function(){
                        deferred.resolve([]);
                    });
            }
            else{
                deferred.reject('no result found');
            }
        });

        return deferred.promise;
    }



    function requestGet (api, path, queryParams){
        var deferred = q.defer();

        request.get(buildRequest(api, path, queryParams), function(error, response, body) {
            if(error){
                deferred.reject(error);
            }
            else if(!Array.isArray(body)) {
                deferred.reject('return type incorrect');
            }
            else if(body.length > 0){
                deferred.resolve(body);
            }
            else{
                deferred.reject('reject');
            }
        });

        return deferred.promise;
    }

    function buildRequest(api, path, queryParams){
        return {
            url: buildUrl(api, path, queryParams),
            json: true,
            rejectUnauthorized: false
        };
    }

    function buildUrl(api, path, queryParams){
        if(api.key){
            queryParams.key = api.key;
        }

        return yuri
            .protocol(api.https ? 'https' : 'http')
            .hostname(api.host)
            .port(api.port)
            .pathname([api.baseUrl, path])
            .query(queryParams)
            .format();
    }

})();
