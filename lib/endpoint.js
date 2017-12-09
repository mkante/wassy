'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _httpclient = require('./httpclient');

var _httpclient2 = _interopRequireDefault(_httpclient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

module.exports = function fn() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  options.host = options.host || 'http://localhost';
  options.uri = options.uri || '/';
  function resolveUrl(urlBindings) {
    var host = options.host,
        uri = options.uri;

    var base = !host ? '' : host;
    var url = base + uri;

    _lodash2.default.each(urlBindings, function (val, key) {
      var search = '{' + key + '}';
      url = url.replace(new RegExp(search, 'g'), val);
    });

    return url;
  }

  return function (_HttpClient) {
    _inherits(Endpoint, _HttpClient);

    function Endpoint(urlBindings) {
      _classCallCheck(this, Endpoint);

      var _this = _possibleConstructorReturn(this, (Endpoint.__proto__ || Object.getPrototypeOf(Endpoint)).call(this, options));

      _this.host = options.host;
      _this.uri = options.uri;
      _this.urlBindings = urlBindings;
      _this.url = resolveUrl(_this.urlBindings);
      return _this;
    }

    _createClass(Endpoint, null, [{
      key: 'extends',
      value: function _extends(newOptions) {
        var params = {};
        _lodash2.default.merge(params, options, newOptions);
        return fn(params);
      }
    }]);

    return Endpoint;
  }(_httpclient2.default);
};