"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _uuid = _interopRequireDefault(require("uuid"));

var _lodash = require("lodash");

var WebService =
/*#__PURE__*/
function () {
  function WebService(_ref) {
    var messager = _ref.messager;
    (0, _classCallCheck2.default)(this, WebService);
    this.init({
      messager: messager
    });
    this.listeners = {};
    this.services = [];
  }

  (0, _createClass2.default)(WebService, [{
    key: "init",
    value: function init(_ref2) {
      var _this = this;

      var messager = _ref2.messager;
      this.messager = messager;
      this.messager.bindReceiveMessageHandler(this.handleReceiveMessage.bind(this));
      setTimeout(function () {
        _this.fetchServices();
      });
    }
    /**
     * 发现可用服务
     */

  }, {
    key: "fetchServices",
    value: function () {
      var _fetchServices = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var data;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.request({
                  type: this.messager.getCheckServiceType()
                });

              case 2:
                data = _context.sent;
                this.services = data.body.functions;

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function fetchServices() {
        return _fetchServices.apply(this, arguments);
      }

      return fetchServices;
    }()
    /**
     * 检测服务是否可用
     * @param {string} type 服务类型
     *  
     */

  }, {
    key: "checkServiceAvailable",
    value: function checkServiceAvailable(type) {
      return this.services.indexOf(type) !== -1;
    }
    /**
     * 处理平台发送给webview的消息
     */

  }, {
    key: "handleReceiveMessage",
    value: function handleReceiveMessage(message) {
      var type = message.type,
          headers = message.headers,
          data = message.data;
      console.log('[webService]receive message', message);
      var eventListeners = this.listeners[type];

      if (!eventListeners) {
        return;
      }

      var reqId = headers.reqId;

      this._handleOnceListeners(eventListeners, reqId, data);

      this._handleNormalListeners(eventListeners, reqId, data);
    }
    /**
     * 处理一次性事件监听器（执行和移除）
     * @param {事件监听器数组} eventListeners 
     * @param {需要匹配的reqId} reqId  不传则不考虑匹配reqId 
     */

  }, {
    key: "_handleOnceListeners",
    value: function _handleOnceListeners(eventListeners, reqId, data) {
      var onceListeners = (0, _lodash.remove)(eventListeners, function (listener) {
        var isReqMatch = listener.reqId && listener.reqId === reqId || !listener.reqId;
        return listener.once && isReqMatch;
      });
      onceListeners.forEach(function (listener) {
        listener.callback && listener.callback(data);
      });
    }
    /**
     * 处理普通事件监听器（执行）
     * @param {事件监听器数组} eventListeners 
     * @param {需要匹配的reqId} reqId  不传则不考虑匹配reqId 
     */

  }, {
    key: "_handleNormalListeners",
    value: function _handleNormalListeners(eventListeners, reqId, data) {
      eventListeners.forEach(function (listener) {
        if (!listener.reqId) {
          listener.callback && listener.callback(data);
          return;
        }

        if (listener.reqId === reqId) {
          listener.callback && listener.callback(data);
        }
      });
    }
    /**
     * 发起请求
     * @param {object} config 请求信息
     */

  }, {
    key: "send",
    value: function send(message) {
      var type = message.type,
          _message$headers = message.headers,
          headers = _message$headers === void 0 ? {
        reqId: (0, _uuid.default)()
      } : _message$headers,
          _message$data = message.data,
          data = _message$data === void 0 ? {} : _message$data;

      if (!type) {
        console.error('type is not supplied');
        return;
      }

      if (!headers.reqId) {
        headers.reqId = (0, _uuid.default)();
      }

      var finalMessage = {
        type: type,
        headers: headers,
        data: data
      };
      this.messager.sendAction(finalMessage);
      console.log('[webService]send action', finalMessage);
      return finalMessage;
    }
    /**
     * 发起请求
     * @param {Message} message 请求信息
     * @return {Promise}
     */

  }, {
    key: "request",
    value: function request(message) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var req = _this2.send(message);

        _this2.on(message.type, {
          callback: function callback(data) {
            resolve(data);
          },
          reqId: req.headers.reqId,
          once: true
        });
      });
    }
    /**
     * 监听事件
     * @param {string} type 监听事件类型 
     * @param {function} callback 监听器回调函数
     * @param {MessageListener} 完整监听器
     */

  }, {
    key: "on",
    value: function on(type, arg) {
      if (!this.listeners[type]) {
        this.listeners[type] = [];
      }

      var messageListener;

      if (typeof arg === 'function') {
        messageListener = {
          callback: arg,
          reqId: '',
          once: false
        };
      } else {
        messageListener = arg;
      }

      this.listeners[type].push(messageListener);
    }
    /**
     * 移除事件监听器
     * @param {监听事件类型} type 
     * @param {监听器属性} messageListener 不传则移除对应事件全部监听器，可指定 callback 或 id 进行移除
     */

  }, {
    key: "off",
    value: function off(type, messageListener) {
      if (!messageListener) {
        delete this.listeners[type];
      }

      var callback = messageListener.callback,
          reqId = messageListener.reqId;
      (0, _lodash.remove)(this.listeners[type], function (listener) {
        return listener.callback === callback || listener.reqId && listener.reqId === reqId;
      });
    }
  }]);
  return WebService;
}();

var _default = WebService;
exports.default = _default;