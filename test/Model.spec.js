var _  = require('underscore');
var Model  = require(__dirname+'/../src/Model.js');
var RequestBuilder  = require(__dirname+'/../src/RequestBuilder.js');
var log = console.log;

RequestBuilder.config({
  testing: true
})

describe("Model Spec", function() {

  it("test default settings", function() {

    var obj = Model.request();
    var stg = obj.settings() ;

    log(stg);
    expect(stg.testing).toBe(true) ;
    expect(true).toBe(true);
  });

  it("test Model different instances", function() {

    var U1 = 'https://api.domain.com/shopping_carts';
    var ModelA = Model.extend({
      config: {
        baseUrl: 'https://api.domain.com',
        'url': '/shopping_carts',
        headers: {
          Accept: 'text/json',
        }
      }
    });
    var a = ModelA.request();
    var aStg = a.settings();

    var ModelB = new Model.extend({
      config: {
        'url': '/account/{id}',
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

    var ModelA = Model.extend({
      config: {
        baseUrl: 'http://api.somewhere.com',
        url: '/checkout',
        headers: {
          Token: 'apple_fruit',
        }
      }
    });
    var ModelB = ModelA.extend({
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
    var ModelA = Model.extend({
      props: {
        name: 'wassy',
        age: 24
      }
    });
    var ModelB = ModelA.extend({
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

    var ModelA = Model.extend({
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

    var ModelA = Model.extend({
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

    var ModelA = Model.extend({
      config: {
        onBeforeRequest: function() {
          this.headers['token'] = 'abcdef';
        },
      }
    });

    var ModelB = ModelA.extend();
    var ModelC = ModelB.extend({
      config: {
        headers: {
          typeC: true,
        },
        onBeforeRequest: function() {
          this.headers['token'] = '911';
        },
      }
    });
    var ModelD = ModelC.extend({
      config: {
        headers: {
          typeD: true,
        },
        onBeforeRequest: null,
      },
    });

    var d1 = ModelB.request().post({ userId: 123 });
    var d2= ModelA.request().get();
    var d3 = ModelC.request().put();
    var d4 = ModelD.request().delete();

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
  });

  it('Test method inheritance', function() {
    var ModelA = Model.extend({
      methods: {
        greeting: function() { return 'A' ;},
        name: function() { return 'wassy' ;},
      }
    });

    var ModelB = ModelA.extend({
      methods: {
        name: function() { return 'moh'; }
      }
    });
    var ModelC = ModelA.extend({
      methods: {
        greeting: function() { return 'C' ; }
      }
    });
    var ModelD = ModelC.extend({
      methods: {
        greeting: function() { return 'D' ; }
      }
    });

    var objC = new ModelC() ;
    var objA = new ModelA() ;
    var objD = new ModelD() ;
    var objB = new ModelB() ;

    expect(objA.greeting()).toBe('A');
    expect(objA.name()).toBe('wassy');
    expect(objB.greeting()).toBe('A');
    expect(objB.name()).toBe('moh');
    expect(objC.greeting()).toBe('C');
    expect(objC.name()).toBe('wassy');

    expect(objD.greeting()).toBe('D');
    expect(objD.name()).toBe('wassy');
  })

});