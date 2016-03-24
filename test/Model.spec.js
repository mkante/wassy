var _  = require('underscore');
var Model  = require(__dirname+'/../src/Model.js');
var RequestBuilder  = require(__dirname+'/../src/RequestBuilder.js');
var log = console.log;

RequestBuilder.testing(true);

describe("Model Spec", function() {

  it("test Model different instances", function() {

    var U1 = 'https://api.domain.com/shopping_carts';
    var ModelA = Model.extends({
      config: {
        baseUrl: 'https://api.domain.com',
        url: '/shopping_carts',
        headers: {
          Accept: 'text/json',
        }
      }
    });
    var a = ModelA.request();
    var aStg = a.settings();

    var ModelB = Model.extends({
      config: {
        url: '/account/{id}',
        headers: {
          Accept: 'text/html',
        }
      }
    });
    var b = ModelB.request({id: 20});
    var bStg = b.settings();

    log(aStg);
    expect(a.getUrl()).toBe(U1) ;
    expect(aStg.headers.Accept).toBe('text/json') ;

    expect(b.getUrl()).toBe('/account/20') ;
    expect(bStg.headers.Accept).toBe('text/html') ;


  });

  it("test Model inheretance", function() {

    var ModelA = Model.extends({
      config: {
        baseUrl: 'http://api.somewhere.com',
        url: '/checkout',
        headers: {
          Token: 'apple_fruit',
        }
      }
    });
    var ModelB = ModelA.extends({
      config: {
        url: '/checkout/{name}',
      }
    })

    var a = ModelA.request();
    var aStg = a.settings();
    expect(a.getUrl()).toBe('http://api.somewhere.com/checkout') ;
    expect(aStg.headers.Token).toBe('apple_fruit') ;

    var b = ModelB.request({ name: 'wassy' });
    var bStg = b.settings();
    expect(b.getUrl()).toBe('http://api.somewhere.com/checkout/wassy') ;
    expect(bStg.headers.Token).toBe('apple_fruit') ;

  });

  it("test Model properties inheretance", function() {
    var ModelA = Model.extends({
      props: {
        name: 'wassy',
        age: 24
      }
    });
    var ModelB = ModelA.extends({
      props: {
        age: 22,
      }
    });

    var a = new ModelA();
    var b = new ModelB();
    var c = new ModelA({ name: 'moh' });
    var d = new ModelA({ name: 'sasha' , age: 18});

    expect(a.get('name')).toBe('wassy');
    expect(a.get('age')).toBe(24);

    expect(b.get('name')).toBe('wassy');
    expect(b.get('age')).toBe(22);

    expect(d.get('name')).toBe('sasha');
    expect(d.get('age')).toBe(18);

    expect(c.get('name')).toBe('moh');
    expect(c.get('age')).toBe(24);

  });

  it("test Model getter ", function() {

    var ModelA = Model.extends({
      props: {
        name: 'wassy',
        age: 24
      }
    });

    var a = new ModelA();
    expect(a.name).toBe('wassy');
    expect(a.get('name')).toBe('wassy');

    // default
    expect(a.get('likes', '2k')).toBe('2k');
  });

  it("test Model methods inheretance", function() {

    var ModelA = Model.extends({
      props: {
        name: 'wassy',
        age: 24
      },
      methods: {

        greeting: function() {
          return 'hello-ha';
        },
        yourName: function() {
          return this.name ;
        }
      }
    });

    var a = new ModelA() ;
    expect(a.greeting()).toBe('hello-ha');
    expect(a.yourName()).toBe('wassy');

  });

  it('Test on before request', function() {

    var ModelA = Model.extends({
      config: {
        onBeforeRequest: function() {
          this.headers['token'] = 'abcdef';
        },
      }
    });

    var ModelB = ModelA.extends();
    var ModelC = ModelB.extends({
      config: {
        headers: {
          typeC: true,
        },
        onBeforeRequest: function() {
          this.headers['token'] = '911';
        },
      }
    });
    var ModelD = ModelC.extends({
      config: {
        headers: {
          typeD: true,
        },
        onBeforeRequest: null,
      },
    });

    var ModelE = ModelC.extends({
      config: {
        onBeforeRequest: function() {
          this._super();
          this.headers['status'] = 400;
        },
      },
    });

    var d1 = ModelB.request().post({ userId: 123 });
    var d2= ModelA.request().get();
    var d3 = ModelC.request().put();
    var d4 = ModelD.request().delete();
    var d5 = ModelE.request().delete();

    //console.log(d1);
    //console.log(d2);
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

    console.log(d5);
    expect(d5.headers.typeC).toBe(true);
    expect(d5.headers.token).toBe('911');
    expect(d5.headers.status).toBe(400);
  });

  it('Test method inheritance', function() {
    var ModelA = Model.extends({
      methods: {
        greeting: function() { return 'A' ;},
        name: function() { return 'wassy' ;},
      }
    });

    var ModelB = ModelA.extends({
      methods: {
        name: function() { return 'moh'; }
      }
    });
    var ModelC = ModelA.extends({
      methods: {
        greeting: function() { return 'C' ; },
        day: function() { return 'Monday' ; },
      }
    });
    var ModelD = ModelC.extends({
      methods: {
        greeting: function() { return 'D' ; },
        day: function() {
          return this._super()+'-12:04AM' ;
        },
      }
    });

    var objC = new ModelC() ;
    var objA = new ModelA() ;
    var objD = new ModelD() ;
    var objB = new ModelB() ;
    var objB2 = new ModelB({name: 'ok', age: 13}) ;

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

  it('Prevent method overriding', function() {

    var A = Model.extends({
      props: {
        age: 21,
      },
      methods: {
        getName: function() { return 'wassy'; },
      }
    });


    var a1 = new A({
      age: 25,
      getName: 'hahah',
    });

    expect(a1.age).toBe(25);
    expect(a1.getName()).toBe('wassy');

  });

});