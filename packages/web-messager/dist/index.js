"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _iframeMessager = require("./iframeMessager");

Object.keys(_iframeMessager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _iframeMessager[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _iframeMessager[key];
    }
  });
});

var _webviewMessager = require("./webviewMessager");

Object.keys(_webviewMessager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _webviewMessager[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _webviewMessager[key];
    }
  });
});

var _IMessager = require("./IMessager");

Object.keys(_IMessager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _IMessager[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _IMessager[key];
    }
  });
});