'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _requestAdaptor = require('./request-adaptor');

var _requestAdaptor2 = _interopRequireDefault(_requestAdaptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpClient = function () {
  function HttpClient(_ref) {
    var _ref$url = _ref.url,
        url = _ref$url === undefined ? 'http://localhost' : _ref$url,
        _ref$headers = _ref.headers,
        headers = _ref$headers === undefined ? {} : _ref$headers,
        _ref$cookies = _ref.cookies,
        cookies = _ref$cookies === undefined ? {} : _ref$cookies,
        model = _ref.model,
        _ref$postRequest = _ref.postRequest,
        postRequest = _ref$postRequest === undefined ? {} : _ref$postRequest,
        _ref$preRequest = _ref.preRequest,
        preRequest = _ref$preRequest === undefined ? _lodash2.default.noop : _ref$preRequest;

    _classCallCheck(this, HttpClient);

    this.url = url;
    this.headers = headers;
    this.cookies = cookies;
    this.postRequest = postRequest;
    this.preRequest = preRequest;
    this.model = model;
  }

  _createClass(HttpClient, [{
    key: 'post',
    value: function post(params, headers) {
      return this.send('POST', params, headers);
    }
  }, {
    key: 'get',
    value: function get(params, headers) {
      return this.send('GET', params, headers);
    }
  }, {
    key: 'delete',
    value: function _delete(params, headers) {
      return this.send('DELETE', params, headers);
    }
  }, {
    key: 'put',
    value: function put(params, headers) {
      return this.send('PUT', params, headers);
    }
  }, {
    key: 'head',
    value: function head(params, headers) {
      return this.send('HEAD', params, headers);
    }
  }, {
    key: 'send',
    value: function send(method, params, headers) {
      var httpHeaders = {};
      _lodash2.default.merge(httpHeaders, this.headers, headers);

      var options = {
        url: this.url,
        method: method,
        headers: httpHeaders,
        body: params
      };
      if (_lodash2.default.isFunction(this.preRequest)) {
        this.preRequest(options);
      }
      options.postRequest = this.postRequest;
      return _requestAdaptor2.default.call(this, options, this.model);
    }
  }]);

  return HttpClient;
}();

module.exports = HttpClient;