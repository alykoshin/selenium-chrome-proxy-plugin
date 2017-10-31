[![npm version](https://badge.fury.io/js/selenium-chrome-proxy-plugin.svg)](http://badge.fury.io/js/selenium-chrome-proxy-plugin)
[![Build Status](https://travis-ci.org/alykoshin/selenium-chrome-proxy-plugin.svg)](https://travis-ci.org/alykoshin/selenium-chrome-proxy-plugin)
[![Coverage Status](https://coveralls.io/repos/alykoshin/selenium-chrome-proxy-plugin/badge.svg?branch=master&service=github)](https://coveralls.io/github/alykoshin/selenium-chrome-proxy-plugin?branch=master)
[![Code Climate](https://codeclimate.com/github/alykoshin/selenium-chrome-proxy-plugin/badges/gpa.svg)](https://codeclimate.com/github/alykoshin/selenium-chrome-proxy-plugin)
[![Inch CI](https://inch-ci.org/github/alykoshin/selenium-chrome-proxy-plugin.svg?branch=master)](https://inch-ci.org/github/alykoshin/selenium-chrome-proxy-plugin)

[![Dependency Status](https://david-dm.org/alykoshin/selenium-chrome-proxy-plugin/status.svg)](https://david-dm.org/alykoshin/selenium-chrome-proxy-plugin#info=dependencies)
[![devDependency Status](https://david-dm.org/alykoshin/selenium-chrome-proxy-plugin/dev-status.svg)](https://david-dm.org/alykoshin/selenium-chrome-proxy-plugin#info=devDependencies)


# selenium-chrome-proxy-plugin

Chrome plugin generator for setting private proxies to use with Selenium


This module is based on https://github.com/RobinDev/Selenium-Chrome-HTTP-Private-Proxy



If you have different needs regarding the functionality, please add a [feature request](https://github.com/alykoshin/selenium-chrome-proxy-plugin/issues).


## Installation

```sh
npm install --save selenium-chrome-proxy-plugin
```

## Usage

For usage please refer to `examples/index.js`.
Do not forget to put `chromedriver` into same directory.  

To run with debug output:

```sh
$ DEBUG=selenium-chrome-proxy-plugin node index
```

Module uses `os.tmpdir()` for temporary files (it depends on OS;`/tmp` for Linux). 
Temp directory may be changed by providing `tempDir` property in config:
Please, do not forget to call `plugin.cleanpu()` to remove temporary files.

```js
  const proxyConfig = {
    host: '<proxy_host>',
    port: '<proxy_port>', 
    username: '<proxy_username>', 
    password: '<proxy_password>',
    tempDir:  './temp' 
  };
  return new ProxyPlugin({
    proxyConfig: proxyConfig
    //chromeOptions: chromeOptions,
  })
    .then((plugin) => {
      console.log('PLUGIN READY');
      return new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(plugin.chromeOptions)
        .build()
        .then((driver) =>
          plugin.cleanup()
            .then(() => driver.get('http://whatismyip.host/'))
            .then(() => console.log('DONE'))
        )
        ;
    })
    .catch((err) => console.log('ERROR:', err))
    ;
```

It is also possible to provide `chromeOptions`:

```js 
return new ProxyPlugin({ proxyConfig: config, options: chromeOptions })
  .then((plugin) => {
  ...
```

May be used with callbacks:

```js
 return new ProxyPlugin({
    proxyConfig: proxyConfig,
    //chromeOptions: chromeOptions,
  }, (err, plugin) => {
  
    ...
    
  });
```

More info along with working examples may be found in `examples` subdirectory.


## Credits
[Alexander](https://github.com/alykoshin/)


# Links to package pages:

[github.com](https://github.com/alykoshin/selenium-chrome-proxy-plugin) &nbsp; [npmjs.com](https://www.npmjs.com/package/selenium-chrome-proxy-plugin) &nbsp; [travis-ci.org](https://travis-ci.org/alykoshin/selenium-chrome-proxy-plugin) &nbsp; [coveralls.io](https://coveralls.io/github/alykoshin/selenium-chrome-proxy-plugin) &nbsp; [inch-ci.org](https://inch-ci.org/github/alykoshin/selenium-chrome-proxy-plugin)


## License

MIT
