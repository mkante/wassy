import { assert } from 'chai';
import { define as EndpointDefine } from '../../src/endpoint';
import {} from '../boot';

const { log } = console;

describe(__filename, () => {
  describe('Options: Model', () => {
    test('test Model different instances', () => {
      const EndA = EndpointDefine({
        host: `${API_HOST}`,
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
      assert.equal(a.url, `${API_HOST}/shopping_carts`);
      assert.equal(a.headers.Accept, 'text/json');

      assert.equal(b.url, `${API_HOST}/account/20`);
      assert.equal(b.headers.Accept, 'text/html');
    });

    test('test Model inheretance', () => {
      const EndA = EndpointDefine({
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

    test('test Model properties inheretance', () => {
      const A = EndpointDefine({
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

    test('test Model getter', async () => {
      const A = EndpointDefine({
        host: API_HOST,
        uri: '/users/500',
      });
      const a = new A();
      log(a);
      const { model } = await a.get();
      assert.equal(model.name, 'wassy');
      assert.equal(model.get('name'), 'wassy');
      // default
      assert.equal(model.get('likes', '2k'), '2k');
    });

    test('test Model methods inheretance', async () => {
      const A = EndpointDefine({
        host: API_HOST,
        uri: '/users/{id}',
        model: {
          name: null,
          id: null,
          greeting() {
            return 'hello-ha';
          },
          yourName() {
            return this.name;
          },
        },
      });

      const a = new A({ id: 500 });
      const { model } = await a.get();
      assert.equal(model.greeting(), 'hello-ha');
      assert.equal(model.yourName(), 'wassy');
      assert.equal(model.get('id'), 500);
    });

    test('Prevent Models method overriding', async () => {
      const A = EndpointDefine({
        host: API_HOST,
        uri: '/users/500',
        model: {
          age: 21,
          getName() { return 'wassy'; },
        },
      });

      const a1 = new (A.extends({
        age: 25,
        getName: 'hahah',
      }))();

      const { model } = await a1.get();
      assert.equal(model.age, 21);
      assert.equal(model.getName(), 'wassy');
    });

    test('Getter', async () => {
      const A = EndpointDefine({
        host: API_HOST,
        uri: '/friends',
        model: {
          name: 'wassy',
          age: 21,
          products: [],
        },
      });

      const a = new A();
      const { model } = await a.get();

      assert.equal(model.get('name'), 'wassy');
      assert.equal(model.get('firstname'), null);
      assert.equal(model.get('lastname', 'wassy'), 'wassy');
      assert.equal(model.get('products[0].name'), 'product_1');
      assert.equal(model.get('products[0].id'), 1);
      assert.equal(model.get('products[0].color', 'red'), 'red');
      assert.equal(model.get('products[1].id'), 2);
      assert.equal(model.get('products[1].name'), 'product_2');
      assert.equal(model.get('products[1].sku.number'), null);
    });

    //
    describe('Non JSON responses', () => {
      test('Empty response', async () => {
        const A = EndpointDefine({
          host: API_HOST,
          uri: '/shopping_carts',
          headers: {
            Accept: 'text/json',
          },
        });
        try {
          await (new A()).delete();
        } catch (e) {
          assert.equal(e.statusText, 'Not Found');
        }
      });
    });
  });

  describe('Option: preRequest', () => {
    const A = EndpointDefine({
      host: API_HOST,
      uri: '/users',
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
    test('#d1', async () => {
      const b = new B();
      const { model, request } = await b.post({ userId: 123 });
      assert.equal(request.method, 'POST');
      assert.equal(model.userId, 123);
      assert.equal(request.headers.token, 'abcdef');
    });

    test('#d2', async () => {
      const a = new A();
      const { request } = await a.get();
      assert.equal(request.method, 'GET');
      assert.equal(request.headers.token, 'abcdef');
    });

    test('#d3', async () => {
      const c = new C();
      const { request } = await c.put();
      assert.equal(request.method, 'PUT');
      assert.equal(request.headers.typeD, undefined);
      assert.equal(request.headers.typeC, true);
      assert.equal(request.headers.token, '911');
    });

    test('#d4', async () => {
      const d = new D({
        postRequest: {
          404: (err, { request }) => {
            assert.equal(request.method, 'DELETE');
            assert.equal(request.headers.token, undefined);
            assert.equal(request.headers.typeD, true);
            assert.equal(request.headers.typeC, true);
          },
        },
      });

      try {
        await d.delete();
      } catch (e) {
        //
      }
    });

    test('#d5', async () => {
      const e = new E({
        postRequest: {
          404: (err, { request }) => {
            assert.equal(request.headers.typeC, true);
            assert.equal(request.headers.status, 400);
          },
        },
      });

      try {
        await e.delete();
      } catch (err) {
        //
      }
    });
  });

  /*
  test('Test method inheritance', () => {
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
});
