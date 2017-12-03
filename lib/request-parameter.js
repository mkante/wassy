'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_URL = 'http://localhost';

var RequestParameter = function () {
  function RequestParameter() {
    _classCallCheck(this, RequestParameter);

    this.host = DEFAULT_URL;
    this.uri = '/';
    this.headers = {};
    this.cookies = {};
  }

  _createClass(RequestParameter, null, [{
    key: 'create',
    value: function create(params) {
      var obj = new RequestParameter();
      obj.host = _lodash2.default.get(params, 'host', DEFAULT_URL);
      obj.uri = _lodash2.default.get(params, 'uri', '/');
      obj.headers = _lodash2.default.get(params, 'headers', {});
      obj.cookies = _lodash2.default.get(params, 'cookies', {});
      return obj;
    }
  }]);

  return RequestParameter;
}();

exports.default = RequestParameter;