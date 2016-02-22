

var $ = require("jquery");
var _ = require("underscore");
var RequestBuilder = require("./RequestBuilder.js");


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

    defaultVal = defaultVal || null;

    var val = _.propertyOf(_data)(key);

    return (!val) ? defaultVal : val;
  };

  this.set = function (key, value) {
      data[key] = value;
  };

};

Model.request = function(urlBindings) {

  var builder = new RequestBuilder(this.__config);
  builder.setBindings(urlBindings);

  return builder;
};


Model.extend = function(settings) {
  var base = this;
  settings = settings || {};


  var newModelClass = function(params) {

    // Copy function level property into instance level
    var defParams = _.clone(_defaults);

    Model.apply(this, [params, defParams]);

    //Copy instance methods
    for (var key in settings.methods) {

      var func = settings.methods[key];

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

  // Copy Static attributes
  for (var key in base) {

    if (base.hasOwnProperty(key)) {

      if (_.isFunction(base[key])) {
        newModelClass[key] = base[key];
      }
      else {
        newModelClass[key] = _.clone(base[key]);
      }

    }
  }

  newModelClass.request = function() {

    this.__config = base.__config|| {};
    _.extend(this.__config,  settings.config);

    var builder = Model.request.apply(this, arguments);
    builder.modelClass(newModelClass);

    return builder;
  };


  return newModelClass;
};

module.exports = Model;