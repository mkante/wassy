

var $ = require("jquery");
var _ = require("underscore");
var RequestBuilder = require("./RequestBuilder.js");


var Model = function(urlBindings){

  var data = {};

  var builder = new RequestBuilder(Model.settings);

  builder.bindings(urlBindings);

  var get = function(key, defaultVal) {

    defaultVal = _.isUndefined(defaultVal) ? null : defaultVal;

    var val = _.propertyOf(this.data)(key);

    return (!val) ? defaultVal : val;
  };

  var set = function (key, value) {
    this.data[key] = value;
  };


  return builder;
};


Model.settings = {};

Model.extend = function(settings) {

  var newClass =  _.clone(Model);

  _.extend(newClass.settings, settings);

  return newClass;
};

module.exports = Model;