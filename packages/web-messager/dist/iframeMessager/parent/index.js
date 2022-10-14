"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParentIframeMessager = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/**
 * iframe 的父级通讯器
 */
var ParentIframeMessagerConstructor = /*#__PURE__*/function () {
  function ParentIframeMessagerConstructor(props) {
    (0, _classCallCheck2.default)(this, ParentIframeMessagerConstructor);
    (0, _defineProperty2.default)(this, "iframe", void 0);
    this.iframe = props.iframe;
  }

  (0, _createClass2.default)(ParentIframeMessagerConstructor, [{
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
      var channel = _ref.channel,
          headers = _ref.headers,
          data = _ref.data;
      window.parent === window && this.iframe.contentWindow.postMessage({
        channel: channel,
        headers: headers,
        data: data
      }, '*');
      return true;
    }
  }]);
  return ParentIframeMessagerConstructor;
}();

var ParentIframeMessager = ParentIframeMessagerConstructor;
exports.ParentIframeMessager = ParentIframeMessager;