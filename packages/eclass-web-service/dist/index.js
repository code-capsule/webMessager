"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _webService = _interopRequireDefault(require("@easiclass/web-service"));

var _messager = require("@easiclass/messager");

var EclassWebService =
/*#__PURE__*/
function () {
  function EclassWebService() {
    (0, _classCallCheck2.default)(this, EclassWebService);
  }

  (0, _createClass2.default)(EclassWebService, [{
    key: "createWebservice",
    value: function createWebservice(messagerType) {
      switch (messagerType) {
        case 'iframe':
          return new _webService.default({
            messager: _messager.iframeMessager
          });

        case 'webview':
          return new _webService.default({
            messager: _messager.webviewMessager
          });

        default:
          break;
      }
    }
  }]);
  return EclassWebService;
}();

var _default = function _default(messagerType) {
  return new EclassWebService().createWebservice(messagerType);
};

exports.default = _default;