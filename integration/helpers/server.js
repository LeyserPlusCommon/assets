/* eslint-disable consistent-return, no-shadow */

/**
 * Express server serving the fixtures
 */

const async = require('async');
const express = require('express');
const fs = require('fs');
const path = require('path');

const resolveData = require('../../lib/data');

const fixtures = path.join(__dirname, '..', 'fixtures');

module.exports = function (callback) {
  // get the contents of the ./fixtures directory
  fs.readdir(fixtures, (err, files) => {
    if (err) return callback(err);

    // sort the fixtures array alphabetically to assure their order is consistent
    return async.map(files.sort(), (file, cb) => {
      // convert fixtures' contents to data URIs
      resolveData(path.join(fixtures, file), cb);
    }, (err, dataUris) => {
      if (err) return callback(err);

      // init an Express server
      const app = express();
      app.set('views', __dirname);
      app.set('view engine', 'ejs');

      // pass data URIs to the template
      app.get('/', (req, res) => {
        res.render('index', { dataUris });
      });

      // start it and trigger the primary callback
      const server = app.listen(3000, () => {
        callback(null, server);
      });
    });
  });
};
