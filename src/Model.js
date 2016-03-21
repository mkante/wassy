

var $ = require("jquery");
var _ = require("underscore");
var RequestBuilder = require("./RequestBuilder.js");
var Config = require("./Config.js");
var Class = require('kaaa-class');

var Model = Class.extend({

  init: function (params) {
    _.extend(this, params);
  },

  get: function(key, defaultVal) {

    defaultVal = (_.isUndefined(defaultVal))? null : defaultVal ;

    var val = _.propertyOf(this)(key);

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