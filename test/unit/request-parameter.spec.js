import { assert } from 'chai';
import _ from 'lodash';
import RequestParam from '../../src/request-parameter';

describe(__filename, () => {
  let req = new RequestParam();
  it('Basic instance usage', () => {
    req = new RequestParam();
    assert.equal(req.host, 'http://localhost');
    assert.equal(req.uri, '/');
    assert.equal(_.isEmpty(req.headers), true);
    assert.equal(_.isEmpty(req.cookies), true);
  });

  it('#create', () => {
    req = RequestParam.create({
      host: 'http://nowhere.com',
      headers: {
        Accept: 'text/json',
      },
    });
    assert.equal(req.host, 'http://nowhere.com');
    assert.equal(req.headers.Accept, 'text/json');
    assert.equal(req.uri, '/');
    assert.equal(_.isEmpty(req.cookies), true);
  });

  it('#toObject', () => {
    req = RequestParam.create({
      host: 'http://somewhere.com',
      uri: '/users',
      headers: {
        Accept: 'text/json',
      },
    });
    const obj = req.toObject();
    assert.equal(req.host, 'http://somewhere.com');
    assert.equal(req.host, obj.host);
    assert.equal(req.uri, obj.uri);
    assert.equal(obj.headers.Accept, 'text/json');
    assert.equal(obj.uri, '/users');
    assert.equal(_.isEmpty(obj.cookies), true);

    // Update object
    obj.uri = '/friends';
    assert.equal(req.uri, '/users');
  });
});
