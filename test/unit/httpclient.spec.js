import { assert } from 'chai';
import nock from 'nock';
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
  });

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
        .then((model) => {
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
        .then((model) => {
          log(model);
          assert.equal(model.id, 434343);
          done();
        })
        .catch((err) => {
          log(err);
        });
    });
  });
});
