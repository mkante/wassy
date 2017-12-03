'use strict';

var _ = require('underscore');

//var Headers = Class.extend();
var StatusCode = Class.extend();

var Config = Class.extend({

  baseUrl: null,
  url: '/',
  cache: true,
  FIXTURES: {},

  onBeforeRequest: function onBeforeRequest() {},

  init: function init() {

    this.headers = {};
    this.statusCode = new StatusCode();
  },

  make: function make(params) {

    params = params || {};

    //console.log(this.constructor);
    var NewConfig = this.constructor.extend(params);

    //
    var NewHeader = _.clone(this.headers);
    var NewStatusCode = this.statusCode.constructor.extend(params.statusCode);

    var config = new NewConfig();
    config.headers = _.extend(NewHeader, params.headers);
    config.statusCode = new NewStatusCode();

    return config;
  }

});

module.exports = function (params) {

  return new Config().make(params);
};