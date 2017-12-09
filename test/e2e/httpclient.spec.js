import { assert } from 'chai';
import nock from 'nock';
import _ from 'lodash';
import HttpClient from '../../src/httpclient';

const { log } = console;

const nockServer = nock('http://nowhere.com');
nockServer.get('/users/1')
  .reply(200, {
    name: 'wassy',
  });

nockServer
  .post('/users', {
    name: 'Kante',
  })
  .reply(200, {
    id: 434343,
  })
  .persist();

nockServer
  .get('/users/1000')
  .reply(501)
  .persist();

nock('http://nowhere.com', {
  reqheaders: {
    Accept: 'text/json',
  },
})
  .get('/fruits')
  .reply(200, [
    'banana',
    'apple',
    'orange',
  ])
  .persist();


describe(__filename, () => {
  let client = null;

  describe('#default parameters', () => {
    client = new HttpClient({});
    assert.equal(client.url, 'http://localhost');
  });

  describe('test HTTP Methods', () => {
    it('#get', (done) => {
      client = new HttpClient({
        url: 'http://nowhere.com/users/1',
      });
      client.get()
        .then(({ model }) => {
          log(model);
          assert.equal(model.name, 'wassy');
          done();
        });
    });

    it('#post', (done) => {
      client = new HttpClient({
        url: 'http://nowhere.com/users',
      });
      client
        .post({
          name: 'Kante',
        })
        .then(({ model }) => {
          log(model);
          assert.equal(model.id, 434343);
          done();
        })
        .catch((err) => {
          log(err);
        });
    });
  });

  describe('Overriding', () => {
    it('Override headers', (done) => {
      client = new HttpClient({
        url: 'http://nowhere.com/fruits',
        headers: {
          Accept: 'text/html',
        },
      });
      client
        .get(null, {
          Accept: 'text/json',
        })
        .then(({ model }) => {
          log(model);
          assert.equal(model.length, 3);
          assert.ok(_.includes(model, 'banana'));
          assert.ok(_.includes(model, 'apple'));
          assert.ok(_.includes(model, 'orange'));
          done();
        });
    });
    it('Override preRequest', (done) => {
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
      client
        .get()
        .then(({ model }) => {
          log(model);
          assert.equal(model.length, 3);
          assert.ok(preRequstCalled);
          assert.ok(_.includes(model, 'banana'));
          assert.ok(_.includes(model, 'apple'));
          assert.ok(_.includes(model, 'orange'));
          done();
        });
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
    });
  });
});
