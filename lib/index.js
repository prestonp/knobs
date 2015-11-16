'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var Knobs = (function (_EventEmitter) {
  _inherits(Knobs, _EventEmitter);

  function Knobs(features) {
    _classCallCheck(this, Knobs);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Knobs).call(this));

    _this.load(features);
    return _this;
  }

  _createClass(Knobs, [{
    key: 'load',
    value: function load(features) {
      if ((typeof features === 'undefined' ? 'undefined' : _typeof(features)) !== 'object') {
        throw new Error('list of features required');
      }

      this.features = features.reduce(function (toggles, feature) {
        if (!feature.name) {
          throw new Error('feature requires a name');
        }

        toggles[feature.name] = process.env[feature.env] || feature.default || false;
        return toggles;
      }, {});

      this.emit('load', this.features);
      return this.features;
    }
  }, {
    key: 'set',
    value: function set(name, val) {
      this.emit('change:' + name, val);
      this.features[name] = val;
      return this.features[name];
    }
  }, {
    key: 'list',
    value: function list() {
      return this.features;
    }
  }, {
    key: 'enabled',
    value: function enabled(name) {
      if (typeof this.features[name] === 'function') {
        var _features;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return (_features = this.features)[name].apply(_features, args);
      }
      return this.features[name];
    }
  }, {
    key: 'disabled',
    value: function disabled(name) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      return !this.enabled.apply(this, [name].concat(args));
    }
  }, {
    key: 'enable',
    value: function enable(name) {
      return this.set(name, true);
    }
  }, {
    key: 'disable',
    value: function disable(name) {
      return this.set(name, false);
    }
  }]);

  return Knobs;
})(_events.EventEmitter);

exports.default = Knobs;