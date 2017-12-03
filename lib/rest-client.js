'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function __ajax(opts, ModelClass) {
  var promise = _jquery2.default.Deferred();

  _jquery2.default.ajax(opts).done(function (response) {
    var data = response;
    var model = null;

    if (_lodash2.default.isArray(data)) {
      model = [];

      _lodash2.default.each(data, function (obj) {
        model.push(new ModelClass(obj));
      });
    } else if (_lodash2.default.isObject(data)) {
      model = new ModelClass(data);
    }

    promise.resolve(model, response);
  }).fail(function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    promise.reject.call(args);
  });
  return promise;
}

var Client = function () {
  function Client(parameter) {
    _classCallCheck(this, Client);

    this.url = url;
    this.asyncReq = true;
    this.beforeHook = _lodash2.default.noop();
    this.modelClass = _lodash2.default.noop();
  }

  _createClass(Client, [{
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
    key: 'send',
    value: function send(method, params, headers) {
      params = params || {};
      headers = headers || {};

      var httpHeaders = {};
      _lodash2.default.merge(httpHeaders, this.config.headers);
      _lodash2.default.merge(httpHeaders, headers);

      if (_lodash2.default.isFunction(this.beforeHook)) {
        var _httpObj = {
          method: method,
          params: params,
          headers: httpHeaders,
          bindings: this.urlBindings,
          _super: this._super
        };
        this.beforeHook.call(_httpObj);
      }

      var options = {
        url: this.getUrl(),
        method: method,
        cache: this.config.cache,
        crossDomain: true,
        headers: httpHeaders,
        statusCode: this.config.statusCode,
        data: params,
        async: this.asyncReq
      };

      return __ajax.call(this, options, this.modelClass);
    }
  }]);

  return Client;
}();

exports.default = Client;