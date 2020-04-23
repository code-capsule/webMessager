"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _webService = _interopRequireDefault(require("@easiclass/web-service"));

var _webMessager = require("@easiclass/web-messager");

var EclassWebService = function EclassWebService(messagerType) {
  (0, _classCallCheck2.default)(this, EclassWebService);

  if (!messagerType) {
    messagerType = window.parent === window ? 'webview' : 'iframe';
  }

  switch (messagerType) {
    case 'iframe':
      return new _webService.default({
        messager: _webMessager.iframeMessager
      });

    case 'webview':
      return new _webService.default({
        messager: _webMessager.webviewMessager
      });
  }
};

var webService;

var _default = function _default(messagerType) {
  if (!webService) {
    return new EclassWebService(messagerType);
  }

  return webService;
};

exports.default = _default;