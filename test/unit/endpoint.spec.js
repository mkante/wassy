import { assert } from 'chai';
import nock from 'nock';
import Endpoint from '../../src/endpoint';

const { log } = console;

nock('http://localhost')
  .get('/account')
  .reply(200, {
    name: 'wassy',
    age: 24,
  })
  .persist();

nock('http://localhost')
  .get('/users/200')
  .reply(200, {
    name: 'wassy',
    age: 24,
  })
  .persist();

nock('http://kante.net', {
  reqheaders: {
    token: 'abcdef',
  },
}).post('/organisations')
  .reply(200, {
    userId: 123,
  })
  .persist();

nock('http://kante.net', {
  reqheaders: {
    token: 'abcdef',
  },
}).get('/organisations')
  .reply(200)
  .persist();

nock('http://kante.net', {
  reqheaders: {
    token: '911',
  },
}).put('/organisations')
  .reply(200)
  .persist();

nock('http://kante.net', {
  reqheaders: {
    typeD: true,
  },
}).delete('/organisations')
  .reply(200)
  .persist();

nock('http://kante.net', {
  reqheaders: {
    typeC: true,
    status: 400,
  },
}).delete('/organisations')
  .reply(200)
  .persist();

nock('http://wassy.net')
  .get('/friends')
  .reply(200, {
    products: [
      {
        id: 1,
        name: 'product_1',
      },
      {
        id: 2,
        name: 'product_2',
      },
    ],
  })
  .persist();

describe('Endpoint Spec', () => {
  it('test Model different instances', () => {
    const U1 = 'https://api.domain.com';
    const EndA = Endpoint({
      host: 'https://api.domain.com',
      uri: '/shopping_carts',
      headers: {
        Accept: 'text/json',
      },
    });
    const a = new EndA();

    const EndB = EndA.extends({
      uri: '/account/{id}',
      headers: {
        Accept: 'text/html',
      },
    });
    const b = new EndB({ id: 20 });

    log(a); log(b);
    assert.equal(a.url, `${U1}/shopping_carts`);
    assert.equal(a.headers.Accept, 'text/json');

    assert.equal(b.url, `${U1}/account/20`);
    assert.equal(b.headers.Accept, 'text/html');
  });

  it('test Model inheretance', () => {
    const EndA = Endpoint({
      host: 'http://api.somewhere.com',
      uri: '/checkout',
      headers: {
        Token: 'apple_fruit',
      },
    });
    const EndB = EndA.extends({ uri: '/checkout/{name}' });

    const a = new EndA();
    assert.equal(a.url, 'http://api.somewhere.com/checkout');
    assert.equal(a.headers.Token, 'apple_fruit');

    const b = new EndB({ name: 'wassy' });
    assert.equal(b.url, 'http://api.somewhere.com/checkout/wassy');
    assert.equal(b.headers.Token, 'apple_fruit');
  });

  it('test Model properties inheretance', () => {
    const A = Endpoint({
      model: {
        name: 'wassy',
        age: 24,
      },
    });
    const B = A.extends({
      model: {
        age: 22,
      },
    });
    const C = A.extends({
      model: {
        name: 'moh',
      },
    });
    const D = A.extends({
      model: {
        name: 'sasha',
        age: 18,
      },
    });
    const a = new A();
    const b = new B();
    const c = new C();
    const d = new D();

    assert.equal(a.model.name, 'wassy');
    assert.equal(a.model.age, 24);

    assert.equal(b.model.name, 'wassy');
    assert.equal(b.model.age, 22);

    assert.equal(d.model.name, 'sasha');
    assert.equal(d.model.age, 18);

    assert.equal(c.model.name, 'moh');
    assert.equal(c.model.age, 24);
  });

  it('test Model getter', (done) => {
    const A = Endpoint({
      uri: '/account',
    });
    const a = new A();
    log(a);
    a.get().then(({ model }) => {
      assert.equal(model.name, 'wassy');
      assert.equal(model.get('name'), 'wassy');

      // default
      assert.equal(model.get('likes', '2k'), '2k');
      done();
    }).catch((err) => {
      log(err);
    });
  });

  it('test Model methods inheretance', (done) => {
    const A = Endpoint({
      uri: '/users/{id}',
      model: {
        name: null,
        age: null,
        greeting() {
          return 'hello-ha';
        },
        yourName() {
          return this.name;
        },
      },
    });

    const a = new A({ id: 200 });
    a.get().then(({ model }) => {
      assert.equal(model.greeting(), 'hello-ha');
      assert.equal(model.yourName(), 'wassy');
      done();
    });
  });

  describe('Test on before request', () => {
    const A = Endpoint({
      host: 'http://kante.net',
      uri: '/organisations',
      preRequest: (opts) => {
        opts.headers.token = 'abcdef';
      },
    });

    const B = A.extends();
    const C = B.extends({
      headers: {
        typeC: true,
      },
      preRequest: (opts) => {
        opts.headers.token = '911';
      },
    });
    const D = C.extends({
      headers: {
        typeD: true,
      },
      preRequest: null,
    });

    const E = C.extends({
      preRequest: (opts) => {
        opts.headers.status = 400;
      },
    });

    // log(d1);
    // log(d2);
    it('#d1', (done) => {
      new B().post({ userId: 123 })
        .then(({ model, request }) => {
          assert.equal(request.method, 'POST');
          assert.equal(model.userId, 123);
          assert.equal(request.headers.token, 'abcdef');
          done();
        }).catch((e) => { log(e); });
    });

    it('#d2', (done) => {
      new A().get()
        .then(({ request }) => {
          assert.equal(request.method, 'GET');
          assert.equal(request.headers.token, 'abcdef');
          done();
        });
    });

    it('#d3', (done) => {
      new C().put().then(({ request }) => {
        assert.equal(request.method, 'PUT');
        assert.equal(request.headers.typeD, undefined);
        assert.equal(request.headers.typeC, true);
        assert.equal(request.headers.token, '911');
        done();
      });
    });

    it('#d4', (done) => {
      new D().delete()
        .then(({ request }) => {
          assert.equal(request.method, 'DELETE');
          assert.equal(request.headers.token, undefined);
          assert.equal(request.headers.typeD, true);
          assert.equal(request.headers.typeC, true);
          done();
        });
    });

    it('#d5', (done) => {
      new E().delete()
        .then(({ request }) => {
          assert.equal(request.headers.typeC, true);
          assert.equal(request.headers.status, 400);
          done();
        });
    });
  });

  /*
  it('Test method inheritance', () => {
    const ModelA = Model.extends({
      model: {
        greetin() { return 'A'; },
        name() { return 'wassy'; },
      },
    });

    const ModelB = ModelA.extends({
      methods: {
        name() { return 'moh'; },
      },
    });
    const ModelC = ModelA.extends({
      methods: {
        greeting() { return 'C'; },
        day() { return 'Monday'; },
      },
    });
    const ModelD = ModelC.extends({
      methods: {
        greeting() { return 'D'; },
        day() {
          return '-12:04AM';
        },
      },
    });

    const objC = new ModelC();
    const objA = new ModelA();
    const objD = new ModelD();
    const objB = new ModelB();
    const objB2 = new ModelB({
      model: {
        name: 'ok', age: 13,
      },
    });

    expect(objA.greeting()).toBe('A');
    expect(objA.name()).toBe('wassy');

    expect(objB.greeting()).toBe('A');
    expect(objB.name()).toBe('moh');
    expect(objB2.name()).toBe('moh');
    expect(objB2.age).toBe(13);

    expect(objC.greeting()).toBe('C');
    expect(objC.name()).toBe('wassy');
    expect(objC.day()).toBe('Monday');

    expect(objD.greeting()).toBe('D');
    expect(objD.name()).toBe('wassy');
    expect(objD.day()).toBe('Monday-12:04AM');
  });
  */

  it('Prevent method overriding', () => {
    const A = Endpoint({
      host: 'http://kante.net',
      uri: '/organisations',
      model: {
        age: 21,
        getName() { return 'wassy'; },
      },
    });

    const a1 = new (A.extends({
      age: 25,
      getName: 'hahah',
    }))();

    a1.get().then(({ model }) => {
      assert.equal(model.age, 25);
      assert.equal(model.getName(), 'wassy');
    });
  });

  it('Getter', (done) => {
    const A = Endpoint({
      host: 'http://wassy.net',
      uri: '/friends',
      model: {
        name: 'wassy',
        age: 21,
        products: [],
      },
    });

    new A().get().then(({ model }) => {
      assert.equal(model.get('name'), 'wassy');
      assert.equal(model.get('firstname'), null);
      assert.equal(model.get('lastname', 'wassy'), 'wassy');
      assert.equal(model.get('products[0].name'), 'product_1');
      assert.equal(model.get('products[0].id'), 1);
      assert.equal(model.get('products[0].color', 'red'), 'red');
      assert.equal(model.get('products[1].id'), 2);
      assert.equal(model.get('products[1].name'), 'product_2');
      assert.equal(model.get('products[1].sku.number'), null);
      done();
    });
  });
});
