"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.childIframeMessager = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

/**
 * 子 iframe 通讯器
 */
var ChildIframeMessager = /*#__PURE__*/function () {
  function ChildIframeMessager() {
    (0, _classCallCheck2.default)(this, ChildIframeMessager);
  }

  (0, _createClass2.default)(ChildIframeMessager, [{
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
      window.parent !== window && window.parent.postMessage({
        type: type,
        headers: headers,
        data: data
      }, '*');
      return true;
    }
  }]);
  return ChildIframeMessager;
}();

var childIframeMessager = new ChildIframeMessager();
exports.childIframeMessager = childIframeMessager;