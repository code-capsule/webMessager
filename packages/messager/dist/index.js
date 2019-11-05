"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _iframeMessager = require("./iframeMessager");

Object.keys(_iframeMessager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
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
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _webviewMessager[key];
    }
  });
});