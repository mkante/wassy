
var _ = require("underscore");
var $ = require("jquery");
var RequestBuilder = require("../src/RequestBuilder.js");
var RequestBuilderDup = require("../src/RequestBuilder.js");
var jsdom = require("jsdom");

var log = console.log ;

RequestBuilder.defaults({
  testing: true,
})

describe ("Request builder instance", function() {

  it("test multi import", function () {
    var obj = new RequestBuilderDup() ;
    var stg = obj.settings() ;

    log(stg);
    expect(stg.testing).toBe(true) ;

  });

  it("test settings", function () {

    var obj = new RequestBuilder() ;
    var stg = obj.settings() ;

    log(stg);

    expect(stg.baseUrl).toBe(null) ;
    expect(stg.url).toBe('/') ;
    expect(stg.cache).toBe(true) ;
    expect(_.has(stg, 'headers')).toBe(true) ;
    expect(_.has(stg, 'statusCode')).toBe(true) ;
    expect(_.has(stg, 'FIXTURES')).toBe(true) ;
    expect(stg.testing).toBe(true) ;
  });

  it("test settigns with params", function () {

    var url = 'http://localhost/v2';
    var obj = new RequestBuilder({
      baseUrl: url,
      cache: false,
      headers: {
        'Access Code': 'my_token'
      },
      testing: false,
      statusCode: {
        400: function() {}
      },
    }) ;
    var stg = obj.settings() ;

    log(stg);

    expect(stg.baseUrl).toBe(url) ;
    expect(stg.url).toBe('/') ;
    expect(stg.cache).toBe(false) ;
    expect(_.has(stg, 'headers')).toBe(true) ;
    expect(stg.headers['Access Code']).toBe('my_token') ;
    expect(_.has(stg, 'statusCode')).toBe(true) ;
    expect(_.isFunction(stg.statusCode[400])).toBe(true);
    expect(_.has(stg, 'FIXTURES')).toBe(true) ;
    expect(stg.testing).toBe(false) ;
  });

  it("test bindings", function () {
    var obj = new RequestBuilder();
    obj.setBindings({ id: 23, name: 'banana'});

    expect(obj.getBinding('id')).toBe(23);
    expect(obj.getBinding('name')).toBe('banana');

    obj.setBinding('id', 50);
    expect(obj.getBinding('id')).toBe(50);

    expect(obj.getBinding('name')).toBe('banana');
  });

  it("test settigns with params", function () {

    var obj = new RequestBuilder({
      url: '/fruits/type/apple',
    }) ;
    expect(obj.getUrl()).toBe('/fruits/type/apple');

    // same instance
    obj = new RequestBuilder({
      url: '/fruits/{id}/apple/{id}',
    }) ;
    obj.setBindings({id: 23}) ;
    expect(obj.getUrl()).toBe('/fruits/23/apple/23');

    // different instances
    obj = new RequestBuilder({
      url: '/fruits/{id}/apple/{name}',
    }) ;
    obj.setBindings({id: 23, name: 'sushi'}) ;
    expect(obj.getUrl()).toBe('/fruits/23/apple/sushi');
  });

  it('Test post method', function (){

    var E1 = 'moh@nowhere.com';
    var P1 = 'we_like_to_move_it';
    var obj = new RequestBuilder({
      url: '/accounts',
      statusCode: {
        500: function() {}
      }
    }) ;

    var proms = obj.post({ email: E1, password: P1});
    log(proms);

    expect(proms.url).toBe('/accounts') ;
    expect(proms.method).toBe('POST') ;
    expect(proms.cache).toBe(true) ;
    expect(proms.crossDomain).toBe(true) ;
    expect(_.isFunction(proms.statusCode[500])).toBe(true) ;
    expect(proms.data.email).toBe(E1) ;
    expect(proms.data.password).toBe(P1) ;

  });

  it('Test PUT method', function (){

    var E1 = 'riahnna@nowhere.com';
    var P1 = 'more_music';
    var obj = new RequestBuilder({
      url: '/grammy',
    }) ;

    var proms = obj.put({ email: E1, password: P1});
    log(proms);

    expect(proms.url).toBe('/grammy') ;
    expect(proms.method).toBe('PUT') ;
    expect(proms.data.email).toBe(E1) ;
    expect(proms.data.password).toBe(P1) ;
  });


  it('Test DELETE method', function (){

    var E1 = 'killer@nowhere.com';
    var P1 = 'dont_let_them_touch_you';
    var obj = new RequestBuilder({
      url: '/zombies',
    }) ;

    var proms = obj.delete({ email: E1, password: P1});
    log(proms);

    expect(proms.url).toBe('/zombies') ;
    expect(proms.method).toBe('DELETE') ;
    expect(proms.data.email).toBe(E1) ;
    expect(proms.data.password).toBe(P1) ;
  });

  it('Test GET method', function (){

    var E1 = 'shreck@nowhere.com';
    var P1 = 'I love to eat';
    var obj = new RequestBuilder({
      url: '/cookies',
    }) ;

    var proms = obj.get({ email: E1, password: P1});
    log(proms);

    expect(proms.url).toBe('/cookies') ;
    expect(proms.method).toBe('GET') ;
    expect(proms.data.email).toBe(E1) ;
    expect(proms.data.password).toBe(P1) ;
  });

})