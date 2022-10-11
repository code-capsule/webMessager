"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebviewMessager = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/**
 * webview通讯器
 */
var WEBVIEW_API = 'webviewExtends';

var WebviewMessager = /*#__PURE__*/function () {
  function WebviewMessager() {
    (0, _classCallCheck2.default)(this, WebviewMessager);
    (0, _defineProperty2.default)(this, "send", void 0);
    (0, _defineProperty2.default)(this, "onready", void 0);
    this.onCreate();
  }

  (0, _createClass2.default)(WebviewMessager, [{
    key: "onCreate",
    value: function onCreate() {
      var _this = this;

      if (!window[WEBVIEW_API]) {
        window[WEBVIEW_API] = {};
      }

      if (!window[WEBVIEW_API]['sendAction']) {
        return;
      }

      Object.defineProperty(window[WEBVIEW_API], 'sendAction', {
        get: function get() {
          return _this.send;
        },
        set: function set(value) {
          _this.send = value;
          _this.onready && _this.onready();
        }
      });
    }
  }, {
    key: "getCheckServiceType",
    value: function getCheckServiceType() {
      return 'common.requestFunctions';
    }
  }, {
    key: "onReceiveMessage",
    value: function onReceiveMessage(messageHandler) {
      if (!window[WEBVIEW_API].callback) {
        window[WEBVIEW_API].callback = function (jsonStr) {
          var message = JSON.parse(jsonStr);
          messageHandler(message);
        };
      }
    }
  }, {
    key: "sendAction",
    value: function sendAction(message) {
      var jsonStr = JSON.stringify(message);

      if (window[WEBVIEW_API].sendAction) {
        window[WEBVIEW_API].sendAction(jsonStr);
        return true;
      } else {
        return false;
      }
    }
  }]);
  return WebviewMessager;
}();

exports.WebviewMessager = WebviewMessager;