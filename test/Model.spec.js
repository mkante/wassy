var _  = require('underscore');
var Model  = require(__dirname+'/../src/Model.js');
var RequestBuilder  = require(__dirname+'/../src/RequestBuilder.js');
var log = console.log;

RequestBuilder.defaults({
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
    expect(a.getUrl()).toBe('/checkout') ;
    expect(aStg.headers.Token).toBe('apple_fruit') ;

    var b = ModelB.request({ name: 'wassy' });
    var bStg = b.settings();
    expect(b.getUrl()).toBe('/checkout/wassy') ;
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

  })

});