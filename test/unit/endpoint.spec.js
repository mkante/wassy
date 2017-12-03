import { expect, assert } from 'chai';
// import nock from 'nock';
import Model from '../../src/model';
import Endpoint from '../../src/endpoint';

const { log } = console;

describe('Endpoint Spec', () => {
  it.only('test Model different instances', () => {
    const U1 = 'https://api.domain.com';
    const EndA = Endpoint.create({
      host: 'https://api.domain.com',
      uri: '/shopping_carts',
      headers: {
        Accept: 'text/json',
      },
    });
    const a = EndA.request();

    const ModelB = EndA.extends({
      uri: '/account/{id}',
      headers: {
        Accept: 'text/html',
      },
    });
    const b = ModelB.request({ id: 20 });

    log(a);
    assert.equal(a.url, `${U1}/shopping_carts`);
    assert.equal(a.headers.Accept, 'text/json');

    assert.equal(b.url, `${U1}/account/20`);
    assert.equal(b.headers.Accept, 'text/html');
  });

  it('test Model inheretance', () => {
    const ModelA = Endpoint.create({
      baseUrl: 'http://api.somewhere.com',
      url: '/checkout',
      headers: {
        Token: 'apple_fruit',
      },
    });
    const ModelB = ModelA.extends({ url: '/checkout/{name}' });

    const a = ModelA.request();
    const aStg = a.settings();
    expect(a.getUrl()).toBe('http://api.somewhere.com/checkout');
    expect(aStg.headers.Token).toBe('apple_fruit');

    const b = ModelB.request({ name: 'wassy' });
    const bStg = b.settings();
    expect(b.getUrl()).toBe('http://api.somewhere.com/checkout/wassy');
    expect(bStg.headers.Token).toBe('apple_fruit');
  });

  it('test Model properties inheretance', () => {
    const a = Endpoint.create({
      model: {
        name: 'wassy',
        age: 24,
      },
    });
    const b = Endpoint.create({
      model: {
        age: 22,
      },
    });

    const c = a.extends({
      model: {
        name: 'moh',
      },
    });
    const d = a.extends({
      model: {
        name: 'sasha',
        age: 18,
      },
    });

    expect(a.get('name')).toBe('wassy');
    expect(a.get('age')).toBe(24);

    expect(b.get('name')).toBe('wassy');
    expect(b.get('age')).toBe(22);

    expect(d.get('name')).toBe('sasha');
    expect(d.get('age')).toBe(18);

    expect(c.get('name')).toBe('moh');
    expect(c.get('age')).toBe(24);
  });

  it('test Model getter', () => {
    const a = Endpoint.create({
      model: {
        name: 'wassy',
        age: 24,
      },
    });

    expect(a.name).toBe('wassy');
    expect(a.get('name')).toBe('wassy');

    // default
    expect(a.get('likes', '2k')).toBe('2k');
  });

  it('test Model methods inheretance', () => {
    const ModelA = Endpoint.create({
      model: {
        name: 'wassy',
        age: 24,
        greeting() {
          return 'hello-ha';
        },
        yourName() {
          return this.name;
        },
      },
    });

    const a = new ModelA();
    expect(a.greeting()).toBe('hello-ha');
    expect(a.yourName()).toBe('wassy');
  });

  it('Test on before request', () => {
    const ModelA = Endpoint.create({
      beforeHook() {
        this.headers.token = 'abcdef';
      },
    });

    const ModelB = ModelA.extends();
    const ModelC = ModelB.extends({
      headers: {
        typeC: true,
      },
      beforeHook() {
        this.headers.token = '911';
      },
    });
    const ModelD = ModelC.extends({
      headers: {
        typeD: true,
      },
      beforeHook: null,
    });

    const ModelE = ModelC.extends({
      beforeHook() {
        this._super();
        this.headers.status = 400;
      },
    });

    const d1 = ModelB.request().post({ userId: 123 });
    const d2 = ModelA.request().get();
    const d3 = ModelC.request().put();
    const d4 = ModelD.request().delete();
    const d5 = ModelE.request().delete();

    // log(d1);
    // log(d2);
    expect(d1.method).toBe('POST');
    expect(d1.data.userId).toBe(123);
    expect(d1.headers.token).toBe('abcdef');

    expect(d2.method).toBe('GET');
    expect(d2.headers.token).toBe('abcdef');

    expect(d3.method).toBe('PUT');
    expect(d3.headers.typeD).toBe(undefined);
    expect(d3.headers.typeC).toBe(true);
    expect(d3.headers.token).toBe('911');


    expect(d4.method).toBe('DELETE');
    expect(d4.headers.token).toBe(undefined);
    expect(d4.headers.typeD).toBe(true);
    expect(d3.headers.typeC).toBe(true);

    log(d5);
    expect(d5.headers.typeC).toBe(true);
    expect(d5.headers.token).toBe('911');
    expect(d5.headers.status).toBe(400);
  });

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

  it('Prevent method overriding', () => {
    const A = Endpoint.create({
      model: {
        age: 21,
        getName() { return 'wassy'; },
      },
    });


    const a1 = A.extends({
      age: 25,
      getName: 'hahah',
    });

    expect(a1.age).toBe(25);
    expect(a1.getName()).toBe('wassy');
  });

  it('Getter', () => {
    const a = new Model({
      name: 'wassy',
      age: 21,
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
    });

    expect(a.get('name')).toBe('wassy');
    expect(a.get('firstname')).toBe(null);
    expect(a.get('lastname', 'wassy')).toBe('wassy');
    expect(a.get('products[0].name')).toBe('product_1');
    expect(a.get('products[0].id')).toBe(1);
    expect(a.get('products[0].color', 'red')).toBe('red');
    expect(a.get('products[1].id')).toBe(2);
    expect(a.get('products[1].name')).toBe('product_2');
    expect(a.get('products[1].sku.number')).toBe(null);
  });
});
