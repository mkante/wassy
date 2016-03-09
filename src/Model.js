

var $ = require("jquery");
var _ = require("underscore");
var RequestBuilder = require("./RequestBuilder.js");
var Config = require("./Config.js");

var Model = function(params, defParams) {

  var _data = defParams || {};
  _.extend(_data, params);

  //Copy instance properties
  for (var key in _data) {

    var val = _data[key];
    if (!_.isFunction(val)) {
      this[key] = val;
    }
  }

  this.get = function(key, defaultVal) {

    defaultVal = (_.isUndefined(defaultVal))? null : defaultVal ;

    var val = _.propertyOf(_data)(key);

    return (_.isUndefined(val) || _.isNull(val))? defaultVal : val;
  };

  this.set = function (key, value) {
      data[key] = value;
  };

};

Model.request = function(urlBindings) {

  var builder = new RequestBuilder(this.__config.params);
  builder.setBindings(urlBindings);

  return builder;
};


Model.extend = function(settings) {
  var base = this;
  base.__config = base.__config || RequestBuilder.config();
  settings = settings || {};


  var newModelClass = function(params) {

    // Copy function level property into instance level
    var defParams = _.clone(_defaults);

    Model.apply(this, [params, defParams]);

    // Copy instance methods
    for (var key in _newMethods) {

      var func = _newMethods[key];

      if (_.isFunction(func)) {
        this[key] = func;
      }
    }
  };

  // Setup class default property
  var oldValues = base.__props || {};
  var _defaults = _.clone(oldValues);
  _.extend(_defaults, settings.props);
  newModelClass.__props = _defaults;

  // Setup methods inheritance
  var oldFuncs= base.__methods || {};
  var _newMethods = _.clone(oldFuncs);
  _.extend(_newMethods, settings.methods);
  newModelClass.__methods = _newMethods;

  _.extend(newModelClass, base);
  newModelClass.__config = base.__config.extend(settings.config);

  newModelClass.request = function() {

    var builder = Model.request.apply(this, arguments)
    builder.modelClass(newModelClass);

    return builder;
  };


  return newModelClass;
};

Model.__config = RequestBuilder.config();

module.exports = Model;