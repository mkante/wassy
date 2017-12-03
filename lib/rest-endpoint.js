'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _restClient = require('./rest-client');

var _restClient2 = _interopRequireDefault(_restClient);

var _requestParameter = require('./request-parameter');

var _requestParameter2 = _interopRequireDefault(_requestParameter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Endpoint = function () {
  function Endpoint() {
    _classCallCheck(this, Endpoint);

    this.requestParam = new _requestParameter2.default();
    this.statusCodes = {};
    this.modelAttributes = _lodash2.default.noop();
  }

  _createClass(Endpoint, [{
    key: 'resolveUrl',
    value: function resolveUrl(urlBindings) {
      var _requestParam = this.requestParam,
          host = _requestParam.host,
          uri = _requestParam.uri;

      var base = !host ? '' : host;
      var url = base + uri;

      _lodash2.default.each(urlBindings, function (val, key) {
        var search = '{' + key + '}';
        url = url.replace(new RegExp(search, 'g'), val);
      });

      return url;
    }
  }, {
    key: 'request',
    value: function request(urlBindings, overrideHeaders) {
      var url = this.resolveUrl(urlBindings);
      var hdrs = {};
      _lodash2.default.merge(hdrs, this.requestParam.headers, overrideHeaders);

      var req = new _restClient2.default(url);
      req.header = hdrs;
      req.beforeHook = this.beforeHook;
      req.modelClass = this.modelAttributes;
      return req;
    }
  }], [{
    key: 'create',
    value: function create(params) {
      var obj = new Endpoint();
      obj.requestParam = _requestParameter2.default.create(params);
      obj.beforeHook = _lodash2.default.get(params, 'beforeSend', _lodash2.default.noop());
      obj.modelAttributes = _lodash2.default.get(params, 'model', {});
      return obj;
    }
  }]);

  return Endpoint;
}();

exports.default = Endpoint;