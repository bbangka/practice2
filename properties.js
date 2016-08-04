(function() {
    'use strict';

    // convenience var for changing the dev camp in one place
    var devServer = 'dev9068';

    var interchange = ({
        dev9041: 'https://41.camp-manager.backcountry.com:19041',
        dev9068: 'https://68.camp-manager.backcountry.com:19068',
        integration: 'https://41.camp-manager.backcountry.com:19041',
        production: 'https://manager.backcountry.com',
        init: function(devServer){
            this.development = this[devServer];
            return this;
        }
    }).init(devServer);

    var facility = {
        "SLCW": {
            "name": "SLCW",
            "ipPrefix": "10.20.",
            "timeZone": "+0006"
        },
        "CVDC": {
            "name": "CVDC",
            "ipPrefix": "10.21.",
            "timeZone": "+0006"
        }
    };

    //TODO connect to API
    var apiProxyIntegration = {
        host: 'apidev.bcinfra.net',
        port: 443,
        https: true,
        key: '8e852a04-5502-4faa-bbab-db592d71f27a'
    };

    var apiProxyProduction = {
        host: 'api.bcinfra.net',
        port: 443,
        https: true,
        key: '5f5db221-6516-4c2f-b739-858e48c18229'
    };

    function generateFrom(apiProxySettings, baseUrl) {
        return {
            host: apiProxySettings.host,
            port: apiProxySettings.port,
            https: apiProxySettings.https,
            key: apiProxySettings.key,
            baseUrl: baseUrl
        };
    }

    var merchApiDevelopment = { host: 'merchdev01.bcinfra.net', port: 8080, baseUrl: 'merchv3' };
    var merchApiIntegration = generateFrom(apiProxyIntegration, 'merch/v3');
    var merchApiProduction = generateFrom(apiProxyProduction, 'merch/v3');

    var wmsApiDevelopment = { host: 'wms-vip.bcinfra.net', port: 80, baseUrl: 'wms' };
    var wmsApiIntegration = generateFrom(apiProxyIntegration, 'wms');
    var wmsApiProduction = generateFrom(apiProxyProduction, 'wms');

    var mediaApiDevelopment = { host: 'productmediadev01.bcinfra.net', port: 8080, baseUrl: 'media'};
    var mediaApiIntegration = generateFrom(apiProxyIntegration, 'media');
    var mediaApiProduction = generateFrom(apiProxyProduction, 'media');

    var contentApiDevelopment = { host: 'alfresco-vip.pp.bcinfra.net', port: 8080, baseUrl: 'content'};
    var contentApiIntegration = { host: 'alfresco-vip.pp.bcinfra.net', port: 8080, baseUrl: 'content'};
    var contentApiProduction = { host: 'alfresco-vip.pp.bcinfra.net', port: 8080, baseUrl: 'content'};

    var matApiDevelopment = { host: 'merchdev01.bcinfra.net', port: 9000, baseUrl: 'mat'};
    var matApiIntegration = generateFrom(apiProxyIntegration, 'mat');
    var matApiProduction = generateFrom(apiProxyProduction, 'mat');

    var sizingApiDevelopment = { host: 'vwcw-dev-sizingapi-vip.bcinfra.net', port: 80, baseUrl: 'content-sizing'};
    var sizingApiIntegration = generateFrom(apiProxyIntegration, 'content-sizing');
    var sizingApiProduction = generateFrom(apiProxyProduction, 'content-sizing');

    var contentIntegrationApiDevelopment = { host: 'content-tools-dev01.bcinfra.net', port: 8080, baseUrl: 'content-integration'};
    var contentIntegrationApiIntegration = generateFrom(apiProxyIntegration, 'content-integration');
    var contentIntegrationApiProduction = generateFrom(apiProxyProduction, 'content-integration');

    /**
     * Facility maps the facility data to a given interchange URL.
     *
     * @property {string} name - the facility name.
     * @property {string} ipPrefix - the IP prefix.
     * @property {string} timeZone - the facility timezone.
     * @property {string} interchange - the interchange URL.
     * @param {hash} facility - the facility data.
     * @param {string} interchange - the interchange URL
     * @constructor
     */
    function Facility(facility, interchange){
        for(var key in facility){
            if(facility.hasOwnProperty(key)){
                this[key] = facility[key];
            }
        }
        this.interchange = interchange;
    }

    //session expiration time in minutes
    var sessionMaxAge = 120;

    var properties = {
        // -----------------------------------------------
        'development': {
            name: 'development',
            hostname: '0.0.0.0',
            port: {
                http: 3001,
                https: 3443
            },
            proxyPrefix: 'product-data-ui',
            apis: {
                merch: merchApiDevelopment,
                media: mediaApiDevelopment,
                wms: wmsApiDevelopment,
                content: contentApiDevelopment,
                mat: matApiDevelopment,
                sizing: sizingApiDevelopment,
                contentIntegration: contentIntegrationApiDevelopment
            },
            cookieOptions: {
                secret: 'dev',
                session: {
                    key: 'dev'
                },
                timeoutCookie: {
                    key: 'xroads',
                    options: {
                        maxAge: sessionMaxAge * 60 * 1000,
                        signed: true
                    }
                }
            },
            facilities: [
                new Facility(facility.SLCW, interchange.development),
                new Facility(facility.CVDC, interchange.development)
            ]
        },
        // -----------------------------------------------
        'integration': {
            name: 'integration',
            hostname: '0.0.0.0',
            port: {
                http: 3001,
                https: 3443
            },
            proxyPrefix: 'product-data-ui',
            apis: {
                merch: merchApiIntegration,
                media: mediaApiIntegration,
                wms: wmsApiIntegration,
                content: contentApiIntegration,
                mat: matApiIntegration,
                sizing: sizingApiIntegration,
                contentIntegration: contentIntegrationApiIntegration
            },
            cookieOptions: {
                secret: 'integra',
                session: {
                    key: 'integra',
                    domain: '.bcinfra.net'
                },
                timeoutCookie: {
                    key: 'xroads',
                    options: {
                        maxAge: sessionMaxAge * 60 * 1000,
                        domain: '.bcinfra.net,.backcountry.com',
                        signed: true
                    }
                }
            },
            facilities: [
                new Facility(facility.SLCW, interchange.integration),
                new Facility(facility.CVDC, interchange.integration)
            ]
        },
        // -----------------------------------------------
        'production': {
            name: 'production',
            hostname: '0.0.0.0',
            port: {
                http: 3001,
                https: 3443
            },
            proxyPrefix: 'product-data-ui',
            apis: {
                merch: merchApiProduction,
                media: mediaApiProduction,
                wms: wmsApiProduction,
                content: contentApiProduction,
                mat: matApiProduction,
                sizing: sizingApiProduction,
                contentIntegration: contentIntegrationApiProduction
            },
            cookieOptions: {
                secret: 'b@ckc0untry',
                session: {
                    key: 'wmsso',
                    domain: '.backcountry.com,.bcinfra.net'
                },
                timeoutCookie: {
                    key: 'xroads',
                    options: {
                        maxAge: sessionMaxAge * 60 * 1000,
                        domain: '.bcinfra.net,.backcountry.com',
                        signed: true
                    }
                }
            },
            facilities: [
                new Facility(facility.SLCW, interchange.production),
                new Facility(facility.CVDC, interchange.production)
            ]
        }
    };

    exports.getProperties = function() {
        if(properties[process.argv[2]]){ 
            return properties[process.argv[2]]; 
        } else { 
            return properties['development']; 
        }
    };

})
();
