'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _restClient = require('./rest-client');

var _restClient2 = _interopRequireDefault(_restClient);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function () {
  function Model(params) {
    _classCallCheck(this, Model);

    // Don't override defined methods
    var classMethods = _lodash2.default.functions(this);
    var filteredParams = _lodash2.default.omit(params, classMethods);
    _lodash2.default.merge(this, filteredParams);
  }

  _createClass(Model, [{
    key: 'get',
    value: function get(key, defaultVal) {

      defaultVal = _lodash2.default.isUndefined(defaultVal) ? null : defaultVal;

      var val = null;
      try {
        var script = "val = this." + key;
        eval(script);
      } catch (e) {}

      return _lodash2.default.isUndefined(val) || _lodash2.default.isNull(val) ? defaultVal : val;
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      this[key] = value;
    }
  }]);

  return Model;
}();

Model._config = (0, _config2.default)();

Model.request = function (urlBindings) {

  var CurrentClass = this;
  var builder = new _restClient2.default(CurrentClass._config);

  builder.setBindings(urlBindings);
  builder.modelClass(CurrentClass);

  return builder;
};

Model.extends = function (settings) {
  settings = settings || {};

  var attrs = {};
  _lodash2.default.extend(attrs, settings.props, settings.methods);
  var NewModelClass = this.extend(attrs);

  NewModelClass._config = this._config.make(settings.config);

  return NewModelClass;
};

module.exports = Model;