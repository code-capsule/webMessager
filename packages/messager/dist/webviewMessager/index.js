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
var ECLASS_API = 'eclassExtends';

var Messager =
/*#__PURE__*/
function () {
  function Messager() {
    (0, _classCallCheck2.default)(this, Messager);
    this.onCreate();
  }

  (0, _createClass2.default)(Messager, [{
    key: "onCreate",
    value: function onCreate() {
      if (!window[ECLASS_API]) {
        window[ECLASS_API] = {};
      }
    }
  }, {
    key: "getCheckServiceType",
    value: function getCheckServiceType() {
      return 'common.requestFunctions';
    }
  }, {
    key: "bindReceiveMessageHandler",
    value: function bindReceiveMessageHandler(messageHandler) {
      if (!window[ECLASS_API].callback) {
        window[ECLASS_API].callback = function (jsonStr) {
          var message = JSON.parse(jsonStr);
          messageHandler(message);
        };
      }
    }
  }, {
    key: "sendAction",
    value: function sendAction(message) {
      var jsonStr = JSON.stringify(message);
      window[ECLASS_API].sendAction && window[ECLASS_API].sendAction(jsonStr);
    }
  }]);
  return Messager;
}();

var _default = new Messager();

exports.default = _default;