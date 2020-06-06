import _ from 'lodash';
import { assert } from 'chai';
import fetch from '../../src/fetch';
import {} from '../boot';

describe(__filename, () => {
  test('Connect error with url argument', async () => {
    try {
      await fetch('http://127.1.2.3:9000/users/1');
    } catch (err) {
      assert.equal(err.status, 0);
      assert.equal(err.statusText, 'error');
    }
  });
  test('Connect error with object argument', async () => {
    try {
      await fetch({ url: 'http://127.1.2.3:9000/users/1' });
    } catch (err) {
      assert.equal(err.status, 0);
      assert.equal(err.statusText, 'error');
    }
  });

  describe('test HTTP Methods', () => {
    test('#get', async () => {
      const { body, model, status } = await fetch(`${API_HOST}/document`);
      expect(body).toEqual('<div>Hello</div>');
      expect(model).toEqual(body);
      expect(status).toEqual(202);
    });

    test('#get', async () => {
      const { model } = await fetch({ url: `${API_HOST}/users` });
      assert.equal(model.length, 3);
      assert.ok(_.includes(model, 'DMX'));
      assert.ok(_.includes(model, 'HOV'));
      assert.ok(_.includes(model, 'RAKIM'));
    });
  });

  describe('Overriding', () => {
    test('Override preRequest', async () => {
      let preRequstCalled = false;
      const { request } = await fetch({
        url: `${API_HOST}/users`,
        headers: {
          Accept: 'text/html',
        },
        preRequest: (opts) => {
          opts.headers.Accept = 'text/json';
          preRequstCalled = true;
        },
      });
      assert.equal(request.headers.Accept, 'text/json');
      assert.ok(preRequstCalled);
    });

    test('Override postRequest', async () => {
      const prms = fetch({
        url: `${API_HOST}/users/100`,
        postRequest: {
          400: (err, resp) => {
            assert.ok(true);
            expect(resp.bodyJSON.id).toEqual(100);
          },
        },
      });

      try {
        await prms;
      } catch (e) {
        //
      }
    });
  });
});

