"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _webService = _interopRequireDefault(require("@codecapsule/web-service"));

var _webMessager = require("@codecapsule/web-messager");

var IFrameWebService = /*#__PURE__*/(0, _createClass2.default)(function IFrameWebService(props) {
  (0, _classCallCheck2.default)(this, IFrameWebService);
  var messagerType = props.messagerType,
      iframe = props.iframe;

  switch (messagerType) {
    case 'parent':
      var parentIframeMessager = new _webMessager.ParentIframeMessager({
        iframe: iframe
      });
      return new _webService.default({
        messager: parentIframeMessager
      });

    case 'child':
      var childIframeMessager = new _webMessager.ChildIframeMessager();
      return new _webService.default({
        messager: childIframeMessager
      });
  }
});
var webService;

var _default = function _default(props) {
  if (!webService) {
    return new IFrameWebService(props);
  }

  return webService;
};

exports.default = _default;