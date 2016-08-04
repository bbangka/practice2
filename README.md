Product Data UI
===============

Purpose
---------------
To view product data

---

Servers
-------
Deploy password on all servers is: productData

#### Development
- VIP
    - vip-dev-productdata.bcinfra.net
- Nodes
    - http://vwcw-dev-productdata-01.bcinfra.net:3001
    - http://vwcw-dev-productdata-02.bcinfra.net:3001
    
#### Production
- VIP
    - vip-prod-productdata.bcinfra.net
- Nodes
    - http://vwdl-prod-productdata-01.bcinfra.net:3001
    - http://vwdl-prod-productdata-02.bcinfra.net:3001

---

Technology Stack
----------------
- AngularJS
- NodeJS
- Express
- Docker
- Jade
- Karma
- Jasmine
- Grunt
- Bower

---

How to Build
------------
Make sure you have node and bower installed.


Building locally:

```
npm install
rm -f -r bower_components
bower cache clean
bower install
grunt test
node server.js
```
