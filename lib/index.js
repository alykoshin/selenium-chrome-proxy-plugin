'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const mkdirp = require('mkdirp');
const uuid = require('uuid');
const debug = require('debug')('selenium-chrome-proxy-plugin');

const Archiver = require('archiver');
//const webdriver = require('selenium-webdriver');

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

function zipFiles(files, tempDir) {
  mkdirp(tempDir);
  const id = uuid.v1();
  const zip_out_pathname = path.join(tempDir, `${id}.zip`);
  const zip_out_file     = fs.createWriteStream(zip_out_pathname);

  const zip = Archiver('zip');

  files.forEach((file) => {
    zip.append(file.text, { name: file.target });
  });

  zip.finalize((error, bytes) => {
    if (error) console.log('zip.finalize error:', error);
    console.log('zip.finalize(): bytes:', bytes);
  });

  zip.pipe(zip_out_file);

  debug(`zipFiles(): zip_out_pathname: ${zip_out_pathname}`);

  return zip_out_pathname;
}


function build(config) {
  if (!config.host || !config.port || !config.username || !config.password) throw new Error('selenium-chrome-proxy-plugin: host, port, username, password must be provided');

  debug(`build(): host: '${config.host}', port: ${config.port}, username: '${config.username}', pasword: '**********`);

  let tempDir = config.tempDir || os.tmpdir(); // path.join(__dirname, 'temp');
  if (!path.isAbsolute(tempDir)) path.join(process.cwd(), tempDir);

  debug(`build(): tempDir: '${tempDir}'`);

  const files = [
    { source: '_manifest.json', target: 'manifest.json', text: '' },
    { source: '_background.js', target: 'background.js', text: '' },
  ];

  readFiles(files, config);
  return zipFiles(files, tempDir);
}


class ProxyPlugin {

  constructor(config, chromeOptions) {
    this.pathname = build(config);
    if (arguments.length > 1) {
      chromeOptions.addExtensions(this.pathname);
    }
  }

  cleanup() {
    fs.unlinkSync(this.pathname);
  }

}


module.exports = ProxyPlugin;
