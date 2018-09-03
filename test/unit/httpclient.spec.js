import { assert } from 'chai';
import _ from 'lodash';
import { HttpClient } from '../../src/httpclient';
import {} from '../boot';

let client;

describe(__filename, () => {
  test('#default parameters', () => {
    client = new HttpClient({});
    assert.equal(client.url, 'http://localhost');
  });

  test('Connect error', async () => {
    client = new HttpClient({
      url: 'http://127.1.2.3:9000/users/1',
    });
    try {
      await client.get();
    } catch (err) {
      assert.equal(err.status, 0);
      assert.equal(err.statusText, 'error');
    }
  });

  describe('test HTTP Methods', () => {
    test('#get', async () => {
      client = new HttpClient({
        url: `${API_HOST}/document`,
      });

      const { body, model, status } = await client.getText();
      expect(body).toEqual('<div>Hello</div>');
      expect(model).toEqual(body);
      expect(status).toEqual(202);
    });

    test('#post', async () => {
      client = new HttpClient({
        url: `${API_HOST}/users`,
      });

      const { status, model } = await client.post({ name: 'kante' });
      assert.equal(status, 201);
      assert.equal(model.name, 'kante');
    });

    test('#postJSON', async () => {
      client = new HttpClient({
        url: `${API_HOST}/users`,
        preRequest: (ops) => {
          // Verify the Content-Type is define
          expect(ops.headers['Content-Type']).toEqual('application/json');
          ops.body.name = 'Aya';
        },
      });
      const { model } = await client.postJSON({ id: 99999 });
      assert.equal(model.id, 99999);
      assert.equal(model.name, 'Aya');
    });

    test('#putJSON', async () => {
      client = new HttpClient({
        url: `${API_HOST}/users`,
        preRequest: (ops) => {
          // Verify the Content-Type is define
          expect(ops.headers['Content-Type']).toEqual('application/json');
        },
      });
      const { model } = await client.putJSON({ name: 'Bear' });
      expect(model.name).toEqual('Bear');
    });

    test('#get', async () => {
      client = new HttpClient({
        url: `${API_HOST}/users`,
      });
      const { model } = await client.get();
      assert.equal(model.length, 3);
      assert.ok(_.includes(model, 'DMX'));
      assert.ok(_.includes(model, 'HOV'));
      assert.ok(_.includes(model, 'RAKIM'));
    });
  });

  describe('Overriding', () => {
    test('Override headers', async () => {
      client = new HttpClient({
        url: `${API_HOST}/users`,
        headers: {
          Accept: 'text/html',
        },
      });
      const { request } = await client.get(null, {
        Accept: 'text/json',
      });
      assert.equal(request.headers.Accept, 'text/json');
    });

    test('Override preRequest', async () => {
      let preRequstCalled = false;
      client = new HttpClient({
        url: `${API_HOST}/users`,
        headers: {
          Accept: 'text/html',
        },
        preRequest: (opts) => {
          opts.headers.Accept = 'text/json';
          preRequstCalled = true;
        },
      });
      const { request } = await client.get();
      assert.equal(request.headers.Accept, 'text/json');
      assert.ok(preRequstCalled);
    });

    test('Override postRequest', async () => {
      client = new HttpClient({
        url: `${API_HOST}/users/100`,
        postRequest: {
          400: (err, resp) => {
            assert.ok(true);
            expect(resp.bodyJSON.id).toEqual(100);
          },
        },
      });

      try {
        await client.get();
      } catch (e) {
        //
      }
    });
  });
});
