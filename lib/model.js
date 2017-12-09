'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function () {
  function Model() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Model);

    var funcs = ['get', 'set', 'toString'];
    _lodash2.default.remove(funcs, function (n) {
      delete params[n];
    });

    _lodash2.default.merge(this, params);
  }

  _createClass(Model, [{
    key: 'get',
    value: function get(key, defaultVal) {
      return _lodash2.default.get(this, key, defaultVal);
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      _lodash2.default.set(this, key, value);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return JSON.stringify(this);
    }
  }]);

  return Model;
}();

module.exports = Model;