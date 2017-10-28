'use strict';

// you need to copy chrome driver into directory from which you start this file
// in order to successfully run the example

const webdriver = require('selenium-webdriver');

//const ProxyPlugin = require('selenium-chrome-proxy-plugin');
const ProxyPlugin = require('../');


function startWithProxy(config) {
  const chrome        = require('selenium-webdriver/chrome');
  const chromeOptions = new chrome.Options();

  const plugin = new ProxyPlugin(config, chromeOptions, (err, plugin) => {
    console.log('PLUGIN READY');

    const driver = new webdriver.Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build()
    ;

    driver.get('http://whatismyip.host/')
      .then(_ => {
        plugin.cleanup();
        console.log('DONE');
      })
    ;

  });

}

module.exports = startWithProxy;
