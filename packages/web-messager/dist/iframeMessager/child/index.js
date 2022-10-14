"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChildIframeMessager = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

/**
 * 子 iframe 通讯器
 */
var ChildIframeMessagerConstructor = /*#__PURE__*/function () {
  function ChildIframeMessagerConstructor() {
    (0, _classCallCheck2.default)(this, ChildIframeMessagerConstructor);
  }

  (0, _createClass2.default)(ChildIframeMessagerConstructor, [{
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
      window.parent !== window && window.parent.postMessage({
        channel: channel,
        headers: headers,
        data: data
      }, '*');
      return true;
    }
  }]);
  return ChildIframeMessagerConstructor;
}();

var ChildIframeMessager = ChildIframeMessagerConstructor;
exports.ChildIframeMessager = ChildIframeMessager;