'use strict';

const startWithProxy = require('./startWithProxy');

const proxies = require('./credentials.json');
proxies.forEach(proxy => startWithProxy(proxy));

// startWithProxy({ host: '<proxy_host>', port: '<proxy_port>', username: '<proxy_username>', password: '<proxy_password>' });
