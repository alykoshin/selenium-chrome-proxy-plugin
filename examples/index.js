'use strict';

// you need to copy chrome driver into directory from which you start this file
// in order to successfully run the example

const webdriver = require('selenium-webdriver');

const ProxyPlugin = require('../');


function startWithProxy(config) {
  const chrome        = require('selenium-webdriver/chrome');
  const chromeOptions = new chrome.Options();

  const plugin = new ProxyPlugin(config, chromeOptions);

  // Another way:
  //
  // const plugin = new ProxyPlugin(config);
  // chromeOptions.addExtensions(plugin.pathname);

  const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build()
  ;
  // Chrome options in Selenium:
  // https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/chrome_exports_Options.html
  //
  // Chrome options:
  // https://sites.google.com/a/chromium.org/chromedriver/capabilities


  driver.get('http://whatismyip.host/')
    .then(() => {
      // do not forget to cleanup
      plugin.cleanup();
    });
}


startWithProxy({ host: '<proxy_host>', port: '<proxy_port>', username: '<proxy_username>', password: '<proxy_password>' });
