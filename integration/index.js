/* eslint-disable no-param-reassign, no-shadow */

import test from 'ava';
import webdrivercss from 'webdrivercss';
import webdriverio from 'webdriverio';

import server from './helpers/server';

test.beforeEach(t => {
  t.context.client = webdriverio.remote({
    desiredCapabilities: {
      browserName: process.env.BROWSER || 'phantomjs',
      build: process.env.TRAVIS_BUILD_NUMBER,
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    },
  });
  webdrivercss.init(t.context.client);
});

test.cb('integration', t => {
  server((err, server) => {
    t.ifError(err);

    t.context.client.init()
      .url('http://localhost:3000')
      .webdrivercss('fixtures', [{
        name: 'fixtures',
        elem: '#fixtures',
      }], (err, res) => {
        t.ifError(err);
        t.true(res.fixtures[0].isWithinMisMatchTolerance);
        t.end();
      })
      .end()
      .call(() => {
        server.close();
      });
  });
});
