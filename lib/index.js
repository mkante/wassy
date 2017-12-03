'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _restEndpoint = require('./src/rest-endpoint');

var _restEndpoint2 = _interopRequireDefault(_restEndpoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create a new RestEndpoint
 * @param params
 * @returns {Endpoint}
 * @constructor
 */
function Endpoint(params) {
  return _restEndpoint2.default.create(params);
}

/**
 *
 * @constructor
 */
function RestClient() {}

exports.default = { Endpoint: Endpoint, RestClient: RestClient };