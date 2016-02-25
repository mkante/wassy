"use strict";

var _ = require("underscore");
var $ = require('jquery');

var defaultSettings = {
  baseUrl: null,

  url: '/',

  cache: true,

  headers: {},

  statusCode: {},

  testing: false,

  FIXTURES: {},

  onBeforeRequest: null
};

var Class = function(params) {

  var urlBindings = {};

  var baseUrl = null;

  var _modelClass = function(){};

  var _settings = _.clone(defaultSettings);
  _.extend(_settings, params);

  if (_.has(params, 'onBeforeRequest')) {
    _settings.onBeforeRequest = params.onBeforeRequest;
  }

  this.settings  = function() {

    return _settings;
  };

  this.setBindings  = function (params) {
    _.extend(urlBindings, params);
    return this;
  };

  this.getBindings  = function () {
    return urlBindings ;
  };

  this.setBinding = function (key, val) {
    var obj = {};
    obj[key] =  val;
    this.setBindings(obj);
    return this;
  };

  this.getBinding = function (key) {
    return _.propertyOf(urlBindings)(key);
  };

  this.getUrl = function () {

    var base = (!_settings.baseUrl)? '' : _settings.baseUrl;
    var url = base + _settings.url;

    _.each (urlBindings, function(val, key) {
      var search = "{"+key+"}";
      url = url.replace(new RegExp(search, 'g'), val);
    });

    return url;
  };

  this.modelClass = function(Class) {

    if (!Class) {
      return _modelClass;
    }

    _modelClass = Class;
  }

  this.post = function (params, headers) {
    return this.send("POST", params, headers);
  };

  this.get = function (params, headers) {
    return  this.send("GET", params, headers);
  };

  this.delete = function  (params, headers) {
    return  this.send("DELETE", params, headers);
  };

  this.put = function (params, headers) {
    return this.send("PUT", params, headers);
  };

  this.send = function (method, params, headers) {

    var httpHeaders = {};
    _.extend(httpHeaders, _settings.headers );
    _.extend(httpHeaders, headers );

    if (_.isFunction(_settings.onBeforeRequest)) {
      // A Hook to override / Add extra parameters to the request
      var _httpObj = {
        method: method,
        headers: httpHeaders,
        bindings: urlBindings,
        params: params,
      };

      _settings.onBeforeRequest.apply(_httpObj);
    }

    var options = {
      url: this.getUrl(),
      method: method,
      cache: _settings.cache,
      crossDomain: true,
      headers: httpHeaders,
      statusCode: _settings.statusCode ,
      data: params,
    };

    if (_settings.testing) {
      return options;
    }

    return __call(options);
  }

  var __call = function (opts) {

    var promise = $.Deferred();

    $.ajax(opts)
      .done(function(response) {

        var data = response;
        var model = null;

        if (_.isArray(data)) {
          model = [];

          _.each (data, function(obj) {
            model.push(new _modelClass(obj));
          });
        }
        else if (_.isObject(data)){
          model = new  _modelClass(data);
        }

        promise.resolve(model, response);
      })
      .fail(function(){

        promise.reject(arguments)
      })
    ;

    return promise;
  };

};

Class.defaults = function(params) {

  if (!params) {
    return defaultSettings;
  }

  _.extend(defaultSettings, params);
}

module.exports = Class;