"use strict";

var _ = require("underscore");
var Class = require('kaaa-class');
var $ = require('jquery');
var Config = require('./Config.js');

var testMode = false;

var Request = Class.extend({

  urlBindings: {},

  _asyncReq: true,

  _modelClass: function(){},

  config: Config(),

  init: function(config) {

    if (config) {
      this.config = config;
    }

  },

  testing: function() {
    return testMode;
  },

  settings: function() {
    return this.config;
  },

  setBindings: function (params) {
    _.extend(this.urlBindings, params);
    return this;
  },

  getBindings: function () {
    return this.urlBindings ;
  },

  setBinding: function (key, val) {
    var obj = {};
    obj[key] =  val;
    this.setBindings(obj);

    return this;
  },

  getBinding: function (key) {
    return _.propertyOf(this.urlBindings)(key);
  },

  getUrl: function () {

    var base = (!this.config.baseUrl)? '' : this.config.baseUrl;
    var url = base + this.config.url;

    _.each (this.urlBindings, function(val, key) {
      var search = "{"+key+"}";
      url = url.replace(new RegExp(search, 'g'), val);
    });

    return url;
  },

  async: function(bool) {
    this._asyncReq = bool;
    return this;
  },

  modelClass: function(Class) {

    if (_.isUndefined(Class)) {
      return this._modelClass;
    }

    this._modelClass = Class;
  },

  post: function (params, headers) {
    return this.send("POST", params, headers);
  },

  get: function (params, headers) {
    return this.send("GET", params, headers);
  },

  delete: function  (params, headers) {
    return  this.send("DELETE", params, headers);
  },

  put: function (params, headers) {
    return this.send("PUT", params, headers);
  },

  send: function (method, params, headers) {

    params = params || {};
    headers = headers || {};

    var httpHeaders = {};
    _.extend(httpHeaders, this.config.headers );
    _.extend(httpHeaders, headers );

    if (_.isFunction(this.config.onBeforeRequest)) {

      var _httpObj = {
        method: method,
        params: params,
        headers: httpHeaders,
        bindings: this.urlBindings,
        _super: this._super,
      };
      this.config.onBeforeRequest.call(_httpObj);
    }

    var options = {
      url: this.getUrl(),
      method: method,
      cache: this.config.cache,
      crossDomain: true,
      headers: httpHeaders,
      statusCode: this.config.statusCode ,
      data: params,
      async: this._asyncReq,
    };

    if (testMode) {
      return options;
    }

    return __ajax.call(this, options);
  },

});


function __ajax (opts) {

  var promise = $.Deferred();
  var self = this;

  $.ajax(opts)
    .done(function(response) {

      var data = response;
      var model = null;

      if (_.isArray(data)) {
        model = [];

        _.each (data, function(obj) {
          model.push(new self._modelClass(obj));
        });
      }
      else if (_.isObject(data)){
        model = new self._modelClass(data);
      }

      promise.resolve(model, response);
    })
    .fail(function(){

      promise.reject(arguments)
    })
  ;

  return promise;
}

Request.testing = function(bool) {

  if (bool == undefined) {
    return testMode;
  }

  testMode = bool;
};

module.exports = Request;