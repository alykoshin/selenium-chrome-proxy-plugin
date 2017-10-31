'use strict';

// you need to copy chrome driver into directory from which you start this file
// in order to successfully run the example

const webdriver = require('selenium-webdriver');

//const ProxyPlugin = require('selenium-chrome-proxy-plugin');
const ProxyPlugin = require('../');


function startWithProxy(config) {
  //const chrome        = require('selenium-webdriver/chrome');
  //const chromeOptions = new chrome.Options();

  return new ProxyPlugin({
    proxyConfig: config
    //chromeOptions: chromeOptions,
  })
    .then((plugin) => {
      console.log('PLUGIN READY');
      return new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(plugin.chromeOptions)
        .build()
        .then((driver) => {
          plugin.cleanup()
            .then(() => driver.get('http://whatismyip.host/'))
            .then(() => console.log('DONE'))
          ;
        })
        ;
    })
    .catch((err) => console.log('ERROR:', err))
    ;
}

module.exports = startWithProxy;

const proxies = require('./credentials.json');
proxies.forEach(proxy => startWithProxy(proxy));

// startWithProxy({ host: '<proxy_host>', port: '<proxy_port>', username: '<proxy_username>', password: '<proxy_password>' });
