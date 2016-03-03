/**
 * Created by moh on 2/29/16.
 */

var _  = require('underscore');

var defaultCfg = {
  baseUrl: null,

  url: '/',

  cache: true,

  headers: {},

  statusCode: {},

  testing: false,

  FIXTURES: {},

  onBeforeRequest: null
};

module.exports = function() {
  var self = this;

  this.params = _.clone(defaultCfg);

  this.get = function() {
    return _conf;
  };

  this.extend =  function(params) {

    var _config = new self.constructor();
    _config.set(this.params);
    _config.set(params);
    return _config;
  };

  this.set =  function(params) {
    if (!params) {
      return ;
    }

    var old = _.clone(this.params);
    _.extend(this.params, params);

    // Add old keys
    // Becarefull respect Overriding;

    for (var key in old.statusCode) {
      if (_.has(params.statusCode, key)) {
        continue;
      }

      this.params.statusCode[key] = old.statusCode[key];
    }

    for (var key in old.headers) {
      if (_.has(params.headers, key)) {
        continue;
      }

      this.params.headers[key] = old.headers[key];
    }
  };

}