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
    proxyConfig: config,
    //chromeOptions: chromeOptions,
  }, (err, plugin) => {
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
  });
}

const proxies = require('./credentials.json');
const proxy0 = proxies[0];

startWithProxy({
  host: proxy0.host,         // proxy host
  port: proxy0.port,         // proxy port
  username: proxy0.username, // proxy username
  password: proxy0.password, // proxy password
});
