
var Config = require('../src/Config.js');
var _ = require('underscore');

describe('get', function(){

  it('Test default params', function() {

    var a = new Config;

    expect(a.params.baseUrl).toBe(null);
    expect(a.params.url).toBe('/');
    expect(a.params.cache).toBe(true);

    expect(_.has(a.params,'statusCode')).toBe(true);
    expect(_.has(a.params,'headers')).toBe(true);
    expect(_.has(a.params,'statusCode')).toBe(true);

    expect(a.params.testing).toBe(false)

  });

  it('Test extend', function() {

    var a = new Config;
    var b = a.extend({
      baseUrl: 'domain',
      cache: false,
      statusCode: {
        500: function() {},
      }
    });
    console.log(a, b, '----');

    expect(a.params.baseUrl).toBe(null);
    expect(a.params.url).toBe('/');
    expect(a.params.cache).toBe(true);
    expect(_.has(a.params.statusCode,'500')).toBe(false);
    expect(a.params.testing).toBe(false);

    expect(b.params.baseUrl).toBe('domain');
    expect(b.params.url).toBe('/');
    expect(b.params.cache).toBe(false);

  });

  it('Test set', function() {

    var a = new Config;
    var b = a.extend({
      baseUrl: 'domain',
      cache: false,
      statusCode: {
        500: function() {},
      }
    });

    expect(_.isFunction(b.params.statusCode[500])).toBe(true);
    expect(_.isUndefined(b.params.statusCode[404])).toBe(true);

    b.set({
      statusCode: {
        404: function(){},
      }
    });
    console.log(b);
    expect(_.isFunction(b.params.statusCode[500])).toBe(true);
    expect(_.isFunction(b.params.statusCode[404])).toBe(true);
    expect(_.isUndefined(b.params.statusCode[200])).toBe(true);

    var c = b.extend({
      statusCode: {
        200: function() {},
      }
    });
    console.log(c);

  });

  describe('StatusCode/Headers override', function() {

    it('StatusCode Override', function() {

      var a = new Config;
      var b = a.extend({
        statusCode: {
          500: function() { return 'B500' ;},
        }
      });
      expect(b.params.statusCode[500]()).toBe('B500');

      b.set({
        statusCode: {
          404: function(){ return 'B404' },
        }
      });

      expect(b.params.statusCode[500]()).toBe('B500');
      expect(b.params.statusCode[404]()).toBe('B404');

      var c = b.extend({
        statusCode: {
          500: function() { return 'C500' ; },
        }
      });

      expect(c.params.statusCode[500]()).toBe('C500');
      expect(c.params.statusCode[404]()).toBe('B404');
    });

    it('headers Override', function() {

      var a = new Config;
      var b = a.extend({
        headers: {
          code: 'B1',
        }
      });
      expect(b.params.headers.code).toBe('B1');

      b.set({
        headers: {
          type: 'B2',
        }
      });

      expect(b.params.headers.code).toBe('B1');
      expect(b.params.headers.type).toBe('B2');

      var c = b.extend({
        headers: {
          code: 'C1',
        }
      });

      expect(c.params.headers.code).toBe('C1');
      expect(c.params.headers.type).toBe('B2');
      expect(b.params.headers.code).toBe('B1');
      expect(b.params.headers.type).toBe('B2');
    });

  });

});
