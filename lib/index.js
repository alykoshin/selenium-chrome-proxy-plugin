'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const mkdirp = require('mkdirp');
const uuid = require('uuid');
const debug = require('debug')('selenium-chrome-proxy-plugin');

const Archiver = require('archiver');
//const webdriver = require('selenium-webdriver');
const chrome      = require('selenium-webdriver/chrome');

/*
  https://github.com/RobinDev/Selenium-Chrome-HTTP-Private-Proxy
*/

function str_replace(names, values, str) {
  names.forEach((name, idx) => {
    str = str.replace(names[idx], values[idx]);
  });
  return str;
}

function readTemplate(filename) {
  return fs.readFileSync(path.join(__dirname, 'templates', filename), 'utf8');
}

//function readTemplate(filename) {
//  return fs.readFileSync(path.join(__dirname, 'templates', filename), 'utf8');
//}
function readFiles(files, config) {
  files.forEach((file) => {
    const text = readTemplate(file.source);
    file.text  = str_replace(
      [ '%proxy_host', '%proxy_port', '%username', '%password' ],
      [ config.host, config.port, config.username, config.password ],
      text
    );
  });
  return files;
}

function zipFiles(files, tempDir, callback) {
  mkdirp(tempDir);
  const id = uuid.v1();
  const zip_out_pathname = path.join(tempDir, `${id}.zip`);
  const zip_out_file     = fs.createWriteStream(zip_out_pathname);

  const archive = Archiver('zip');

  files.forEach((file) => {
    archive.append(file.text, { name: file.target });
  });

  archive.finalize((error, bytes) => {
    if (error) console.log('zip.finalize error:', error);
    debug(`zipFiles(): archive.finalize(): bytes:`, bytes);
  });

  zip_out_file.on('close', function() {
    debug(`zipFiles(): on(close): total bytes: ${archive.pointer()}; archiver has been finalized and the output file descriptor has closed.`);
    callback(null, zip_out_pathname);
  });

// This event is fired when the data source is drained no matter what was the data source.
// It is not part of this library but rather from the NodeJS Stream API.
// @see: https://nodejs.org/api/stream.html#stream_event_end
  zip_out_file.on('end', function() {
    debug('zipFiles(): on(end): Data has been drained');
  });

// good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function(err) {
    if (err.code === 'ENOENT') {
      debug(`zipFiles(): archive.on(warning):`, err);
    } else {
      debug(`zipFiles(): archive.on(warning):`, err);
//      throw err;
    }
  });

  archive.on('error', function(err) {
    throw err;
  });

  archive.pipe(zip_out_file);

  debug(`zipFiles(): zip_out_pathname: ${zip_out_pathname}`);
  return zip_out_pathname;
}


function build(proxyConfig, callback) {
  if (!proxyConfig || !proxyConfig.host || !proxyConfig.port || !proxyConfig.username || !proxyConfig.password)
    throw new Error('selenium-chrome-proxy-plugin: host, port, username, password must be provided');

  debug(`build(): host: '${proxyConfig.host}', port: ${proxyConfig.port}, username: '${proxyConfig.username}', pasword: '**********`);

  let tempDir = proxyConfig.tempDir || os.tmpdir(); // path.join(__dirname, 'temp');
  if (!path.isAbsolute(tempDir)) path.join(process.cwd(), tempDir);

  debug(`build(): tempDir: '${tempDir}'`);

  const files = [
    { source: '_manifest.json', target: 'manifest.json', text: '' },
    { source: '_background.js', target: 'background.js', text: '' },
  ];

  readFiles(files, proxyConfig);
  return zipFiles(files, tempDir, (err, zip_out_pathname) => {
    return callback(err, zip_out_pathname);
  });
}


class ProxyPlugin {

  constructor(config, chromeOptions, callback) {
    config = config || {};
    callback = (typeof callback === 'function') ? callback : function() {};

    return new Promise((resolve, reject) => {
      this.pathname = build(config.proxy, (err, zip_out_pathname) => {
        if (err) {
          callback(err);
          return reject(err);
        }
        config.options = config.options || new chrome.Options();
        chromeOptions.addExtensions(this.pathname);

        callback(null, this);
        return resolve(this);
      });
    });
  }

  cleanup() {
    fs.unlinkSync(this.pathname);
  }

}


module.exports = ProxyPlugin;
