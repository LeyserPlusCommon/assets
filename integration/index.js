/* eslint-disable no-param-reassign, no-shadow */

import test from 'ava';
import webdrivercss from 'webdrivercss';
import webdriverio from 'webdriverio';

import server from './helpers/server';

test.beforeEach(t => {
  // start an Express server serving the fixtures
  t.context.client = webdriverio.remote({
    desiredCapabilities: {
      browserName: 'phantomjs',
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
