"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var Logger = /*#__PURE__*/function () {
  function Logger(option, namespace) {
    (0, _classCallCheck2.default)(this, Logger);
    (0, _defineProperty2.default)(this, "option", false);
    (0, _defineProperty2.default)(this, "namespace", '');
    this.option = option;
    this.namespace = namespace;
  }

  (0, _createClass2.default)(Logger, [{
    key: "logMessage",
    value: function logMessage(tip, message) {
      if (!this.option) return;
      var prefixText = "[WebService][".concat(this.namespace, "] ").concat(tip);

      if (this.option === true) {
        console.info(prefixText, message);
      } else {
        var ignore = this.option.ignore;

        if (ignore.indexOf(message.channel) === -1) {
          console.info(prefixText, message);
        }
      }
    }
  }, {
    key: "info",
    value: function info() {
      var _console;

      if (!this.option) return;

      (_console = console).info.apply(_console, arguments);
    }
  }]);
  return Logger;
}();

exports.default = Logger;