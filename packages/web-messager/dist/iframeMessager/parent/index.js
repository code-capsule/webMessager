"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parentIframeMessager = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/**
 * iframe 的父级通讯器
 */
var ParentIframeMessager = /*#__PURE__*/function () {
  function ParentIframeMessager() {
    (0, _classCallCheck2.default)(this, ParentIframeMessager);
    (0, _defineProperty2.default)(this, "iframe", void 0);
  }

  (0, _createClass2.default)(ParentIframeMessager, [{
    key: "setIframe",
    value: function setIframe(iframe) {
      this.iframe = iframe;
    }
  }, {
    key: "getCheckServiceType",
    value: function getCheckServiceType() {
      return 'common.requestFunctions';
    }
  }, {
    key: "onReceiveMessage",
    value: function onReceiveMessage(messageHandler) {
      window.addEventListener('message', function (e) {
        e.data.headers && messageHandler(e.data);
      });
    }
  }, {
    key: "sendAction",
    value: function sendAction(_ref) {
      var type = _ref.type,
          headers = _ref.headers,
          data = _ref.data;
      window.parent === window && this.iframe.contentWindow.postMessage({
        type: type,
        headers: headers,
        data: data
      }, '*');
      return true;
    }
  }]);
  return ParentIframeMessager;
}();

var parentIframeMessager = new ParentIframeMessager();
exports.parentIframeMessager = parentIframeMessager;