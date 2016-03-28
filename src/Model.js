

var $ = require("jquery");
var _ = require("underscore");
var RequestBuilder = require("./RequestBuilder.js");
var Config = require("./Config.js");
var Class = require('kaaa-class');

var Model = Class.extend({

  init: function (params) {

    // Don't override defined methods
    var classMethods = _.functions(this);
    var filteredParams = _.omit(params, classMethods);
    _.extend(this, filteredParams);
  },

  get: function(key, defaultVal) {

    defaultVal = (_.isUndefined(defaultVal))? null : defaultVal ;

    var val = null;
    try {
      var script = "val = this." + key ;
      eval(script);
    }
    catch(e){}

    return (_.isUndefined(val) || _.isNull(val))? defaultVal : val;
  },

  set: function (key, value) {
    this[key] = value;
  },

});


Model._config = Config();

Model.request = function(urlBindings) {

  var CurrentClass = this;
  var builder = new RequestBuilder(CurrentClass._config);

  builder.setBindings(urlBindings);
  builder.modelClass(CurrentClass);

  return builder;
};

Model.extends = function(settings) {
  settings = settings || {};

  var attrs = {} ;
  _.extend(attrs, settings.props, settings.methods);
  var NewModelClass = this.extend(attrs);


  NewModelClass._config = this._config.make(settings.config);

  return NewModelClass;
};

module.exports = Model;