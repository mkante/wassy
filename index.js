

var RequestBuilder = require("./src/RequestBuilder.js");
var Model = require("./src/Model.js");

module.exports.config = function(params) {
  RequestBuilder.defaults(params);
};

module.exports.Model = Model;
