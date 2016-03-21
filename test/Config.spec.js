
var Config = require('../src/Config.js');
var _ = require('underscore');

describe('Config', function(){

  it('Test default params', function() {

    var a = new Config();

    expect(a.baseUrl).toBe(null);
    expect(a.url).toBe('/');
    expect(a.cache).toBe(true);

    expect(_.has(a,'statusCode')).toBe(true);
    expect(_.has(a,'headers')).toBe(true);
    expect(_.has(a,'statusCode')).toBe(true);

  });

  it('Test extend', function() {

    var a = Config();
    var b = a.make({
      baseUrl: 'domain',
      cache: false,
      statusCode: {
        500: function() {},
      }
    });
    console.log(a, b, '----');

    expect(a.baseUrl).toBe(null);
    expect(a.url).toBe('/');
    expect(a.cache).toBe(true);
    expect(_.has(a.statusCode,'500')).toBe(false);

    expect(b.baseUrl).toBe('domain');
    expect(b.url).toBe('/');
    expect(b.cache).toBe(false);

  });

  describe('StatusCode/Headers override', function() {

    it('StatusCode Override', function() {

      var a = Config();
      var b = a.make({
        statusCode: {
          500: function() { return 'B500' ;},
        }
      });
      expect(b.statusCode[500]()).toBe('B500');

      var c = b.make({
        statusCode: {
          404: function() { return 'C404' ; },
          500: function() { return 'C500' ; },
        }
      });

      var d = c.make({
        statusCode: {
          404: function() { return this._super() ; },
        }
      });

      expect(d.statusCode[500]()).toBe('C500');
      expect(d.statusCode[404]()).toBe('C404');
    });

    it('headers Override', function() {

      var a = new Config();
      var b = a.make({
        headers: {
          code: 'B1',
        }
      });
      expect(b.headers.code).toBe('B1');


      var c = b.make({
        headers: {
          type: 'CT',
          code: 'C1',
        }
      });

      expect(c.headers.code).toBe('C1');
      expect(c.headers.type).toBe('CT');
      expect(b.headers.code).toBe('B1');
      expect(b.headers.type).toBe(undefined);
    });

  });

  describe("onBeforeRequest", function() {

    var a = new Config({
      url: '/home',
      onBeforeRequest: function() {
        return "beforeA";
      }
    });

    var b = a.make({
      onBeforeRequest: function() {
        return this._super()+"-"+'beforeB';
      }
    });
    var c = b.make({
      onBeforeRequest: function() {
        return this._super()+"-"+'beforeC';
      }
    });

    expect(a.url).toBe('/home');
    expect(c.onBeforeRequest()).toBe('beforeA-beforeB-beforeC');
    expect(a.onBeforeRequest()).toBe('beforeA');
    expect(b.onBeforeRequest()).toBe('beforeA-beforeB');
  });

});
