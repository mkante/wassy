import { assert } from 'chai';
import _ from 'lodash';
import { mockMostRecent } from '../util';
import HttpClient from '../../src/httpclient';

const { log } = console;


describe(__filename, () => {
  beforeEach(() => {
    jasmine.Ajax.install();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
  });
  let client = null;

  describe('#default parameters', () => {
    client = new HttpClient({});
    assert.equal(client.url, 'http://localhost');
  });

  describe('test HTTP Methods', () => {
    it('#get', () => {
      client = new HttpClient({
        url: 'http://nowhere.com/users/1',
      });
      const prms = client.get()
        .then(({ model }) => {
          log(model);
          assert.equal(model.name, 'wassy');
        });

      mockMostRecent({
        body: {
          name: 'wassy',
        },
      });
      return prms;
    });

    it('#post', () => {
      client = new HttpClient({
        url: 'http://nowhere.com/users',
      });
      const prms = client.post({ name: 'Kante' })
        .then(({ model }) => {
          log(model);
          assert.equal(model.id, 434343);
        })
        .catch((err) => {
          log(err);
        });
      mockMostRecent({
        body: {
          id: 434343,
        },
      });
      return prms;
    });

    it('#postJSON', () => {
      client = new HttpClient({
        url: 'http://nowhere.com/fruits',
        preRequest: (ops) => {
          // Verify the Content-Type is define
          assert.equal(ops.headers['Content-Type'], 'application/json');
        },
      });
      const prms = client.postJSON({ name: 'apple' })
        .then(({ model }) => {
          log(model);
          assert.equal(model.id, 99999);
        })
        .catch((err) => {
          log(err);
        });
      mockMostRecent({
        body: {
          id: 99999,
        },
      });
      return prms;
    });

    it('#putJSON', () => {
      client = new HttpClient({
        url: 'http://nowhere.com/drinks',
        preRequest: (ops) => {
          // Verify the Content-Type is define
          assert.equal(ops.headers['Content-Type'], 'application/json');
        },
      });
      const prms = client.putJSON({ name: 'Bear' });
      mockMostRecent();
      return prms;
    });
  });

  describe('Overriding', () => {
    it('Override headers', () => {
      client = new HttpClient({
        url: 'http://nowhere.com/fruits',
        headers: {
          Accept: 'text/html',
        },
      });
      const prms = client
        .get(null, {
          Accept: 'text/json',
        })
        .then(({ model }) => {
          log(model);
          assert.equal(model.length, 3);
          assert.ok(_.includes(model, 'banana'));
          assert.ok(_.includes(model, 'apple'));
          assert.ok(_.includes(model, 'orange'));
        });

      mockMostRecent({
        body: ['banana', 'apple', 'orange'],
      });
      return prms;
    });
    it('Override preRequest', () => {
      let preRequstCalled = false;
      client = new HttpClient({
        url: 'http://nowhere.com/fruits',
        headers: {
          Accept: 'text/html',
        },
        preRequest: (opts) => {
          opts.headers.Accept = 'text/json';
          preRequstCalled = true;
        },
      });
      const prms = client
        .get()
        .then(({ model }) => {
          log(model);
          assert.equal(model.length, 3);
          assert.ok(preRequstCalled);
          assert.ok(_.includes(model, 'banana'));
          assert.ok(_.includes(model, 'apple'));
          assert.ok(_.includes(model, 'orange'));
        });
      mockMostRecent({
        body: ['banana', 'apple', 'orange'],
      });
      return prms;
    });
    it('Override postRequest', (done) => {
      client = new HttpClient({
        url: 'http://nowhere.com/users/1000',
        postRequest: {
          501: () => {
            assert.ok(true);
            done();
          },
        },
      });
      client.get();
      mockMostRecent({ status: 501 });
    });
  });
});
