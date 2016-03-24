var _  = require('underscore');
var Wassy  = require(__dirname+'/../index.js');
var RequestBuilder  = require(__dirname+'/../src/RequestBuilder.js');
var log = console.log;

RequestBuilder.testing(true);

describe("Index", function() {

  it('Test1', function() {

    var A = Wassy.Model.extends({
      config: {
        baseUrl: 'http://banana.com',
      }
    });

    var B = A.extends({
      config: {
        url: '/home',
      }
    });

    var r1 = A.request().get({ name: 'me'});
    expect(r1.url).toBe('http://banana.com/');
    expect(r1.data.name).toBe('me');

  });

});


