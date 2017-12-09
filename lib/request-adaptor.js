'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* eslint global-require: "off" */


var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rp = null;
if (global.document) {
  rp = require('browser-request');
} else {
  rp = require('request');
}

function toReponseItemModel(responseData, modelProperties) {
  if ((typeof responseData === 'undefined' ? 'undefined' : _typeof(responseData)) !== 'object') {
    return responseData;
  }
  var item = {};
  _lodash2.default.merge(item, modelProperties, responseData);
  return new _model2.default(item);
}

function handlePostRequest(err, response, postHandlers) {
  var code = _lodash2.default.get(response, 'statusCode');
  if (!_lodash2.default.has(postHandlers, code)) {
    return;
  }
  postHandlers[code](err, response);
}

module.exports = function (opts, modelDefinition) {
  opts.json = true;
  var promise = new Promise(function (resolve, reject) {
    rp(opts, function (err, response, data) {
      handlePostRequest(err, response, opts.postRequest);
      if (err) {
        reject(err, response);
        return;
      }

      var model = null;
      if (_lodash2.default.isArray(data)) {
        model = [];

        _lodash2.default.each(data, function (obj) {
          var respItem = toReponseItemModel(obj, modelDefinition);
          model.push(respItem);
        });
      } else if (_lodash2.default.isObjectLike(data)) {
        model = toReponseItemModel(data, modelDefinition);
      } else {
        model = data;
      }

      response.model = model;
      resolve(response);
    });
  });
  return promise;
};