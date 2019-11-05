"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

/**
 * eclass webview通讯器
 */
var Messager =
/*#__PURE__*/
function () {
  function Messager() {
    (0, _classCallCheck2.default)(this, Messager);
  }

  (0, _createClass2.default)(Messager, [{
    key: "getCheckServiceType",
    value: function getCheckServiceType() {
      return 'common.requestFunctions';
    }
  }, {
    key: "bindReceiveMessageHandler",
    value: function bindReceiveMessageHandler(messageHandler) {
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
    }
  }]);
  return Messager;
}();

var _default = new Messager();

exports.default = _default;