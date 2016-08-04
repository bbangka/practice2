describe('Search', function () {
    'use strict';
    var search = require('../routes/search.js');
    var returnedData = [];
    var request = require('request');


    describe('doSearch', function(){
        var mockGetRequest;


        it('should called with invalid', function(done){
            mockGetRequest = function(mockUrl, mockCallback){
                if(mockUrl.url.indexOf("skus=")>-1) {
                    mockCallback(null, null, []);
                }
                else if (mockUrl.url.indexOf("styles")>-1) {
                    mockCallback(null, null, []);
                }
                else if (mockUrl.url.indexOf("vendorSku")>-1) {
                    mockCallback(null, null, []);
                }
                else {
                    mockCallback(null, null, []);
                }
            };
            spyOn(request, 'get').andCallFake(mockGetRequest);
            search.doSearch({query:{search:'TNF011Q-'}}, {send:function(data){
                returnedData = data;
                expect(returnedData.length).toEqual(0);
                done();
            }});
            expect(request.get).toHaveBeenCalledWith({url: 'http://merchdev01.bcinfra.net:8080/merchv3/products?styles=TNF011Q-&variant=false', json: true, rejectUnauthorized: false}, jasmine.any(Function));
            expect(request.get).toHaveBeenCalledWith({url: 'http://merchdev01.bcinfra.net:8080/merchv3/product-search?searchString=TNF011Q-&limit=10', json: true, rejectUnauthorized: false}, jasmine.any(Function));
            expect(request.get).toHaveBeenCalledWith({url: 'http://merchdev01.bcinfra.net:8080/merchv3/products?skus=TNF011Q-&variant=false', json: true, rejectUnauthorized: false}, jasmine.any(Function));
        });
        it('should called with style', function(done){
            mockGetRequest = function(mockUrl, mockCallback){
                if(mockUrl.url.indexOf("skus=")>-1) {
                    mockCallback(null, null, []);
                }
                else if (mockUrl.url.indexOf("styles")>-1) {
                    mockCallback(null, null, [{}]);
                }
                else if (mockUrl.url.indexOf("vendor")>-1) {
                    mockCallback(null, null, []);
                }
                else {
                    mockCallback(null, null, [{},{},{}]);
                }
            };
            spyOn(request, 'get').andCallFake(mockGetRequest);
            search.doSearch({query:{search:'TNF011Q'}}, {send:function(data){
                returnedData = data;
                expect(returnedData.length).toEqual(1);
                done();
            }});
        });

        it('should return skus', function(done){
            mockGetRequest = function(mockUrl, mockCallback){
                if(mockUrl.url.indexOf("skus=")>-1) {
                    mockCallback(null, null, [{}]);
                }
                else if (mockUrl.url.indexOf("styles")>-1) {
                    mockCallback(null, null, []);
                }
                else if (mockUrl.url.indexOf("vendor")>-1) {
                    mockCallback(null, null, []);
                }
                else {
                    mockCallback(null, null, [{}, {}, {}, {}]);
                }
            };
            spyOn(request, 'get').andCallFake(mockGetRequest);
            search.doSearch({query:{search:'TNF011Q-'}}, {send:function(data){
                returnedData = data;
                expect(returnedData.length).toEqual(1);
                done();
            }});
        });

        it('should return vendor', function(done){
            mockGetRequest = function(mockUrl, mockCallback){
                if(mockUrl.url.indexOf("skus=") > -1 && mockUrl.url.indexOf("TNF0115") < 0) {
                    mockCallback(null, null, []);
                }
                else if (mockUrl.url.indexOf("styles")>-1) {
                    mockCallback(null, null, []);
                }
                else if (mockUrl.url.indexOf("vendor")>-1) {
                    console.log("abcdfqwef");
                    mockCallback(null, null, [{sku:"TNF0115"}]);
                }
                else if (mockUrl.url.indexOf("TNF0115")>-1) {
                    mockCallback(null, null, [{}]);
                }
                else {
                    mockCallback(null, null, [{}, {}, {}, {}]);
                }
            };
            spyOn(request, 'get').andCallFake(mockGetRequest);
            search.doSearch({query:{search:'abcde'}}, {send:function(data){
                returnedData = data;
                expect(returnedData.length).toEqual(1);
                done();
            }});
        });

        it('should return title search result', function(done){
            mockGetRequest = function(mockUrl, mockCallback){
                if(mockUrl.url.indexOf("skus=")>-1) {
                    mockCallback(null, null, []);
                }
                else if (mockUrl.url.indexOf("styles") > -1 && mockUrl.url.indexOf("abc") < 0) {
                    mockCallback(null, null, []);
                }
                else if (mockUrl.url.indexOf("vendor")>-1) {
                    mockCallback(null, null, []);
                }
                else if (mockUrl.url.indexOf("abc") > -1) {
                    mockCallback(null, null, [{}, {}, {}]);
                }
                else {
                    mockCallback(null, null, [{style: "abc"}, {style: "abc"}, {style: "abc"}]);
                }

            };
            spyOn(request, 'get').andCallFake(mockGetRequest);
            search.doSearch({query:{search:'qfwere'}}, {send:function(data){
                returnedData = data;
                expect(returnedData.length).toEqual(3);
                done();
            }});
        });

        it('should return title search result', function(done){
            mockGetRequest = function(mockUrl, mockCallback){
                mockCallback(null, null, "abc");
            };
            spyOn(request, 'get').andCallFake(mockGetRequest);
            search.doSearch({query:{search:'qfwere'}}, {send:function(data){
                returnedData = data;
                expect(returnedData.length).toEqual(0);
                done();
            }});
        });
    });

});