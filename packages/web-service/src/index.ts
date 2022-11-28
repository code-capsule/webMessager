import uuid from "uuid";
import { remove, merge } from "lodash";
import { IMessager, Message } from "@codecapsule/web-messager";
import { MessageListener } from "./types";
import Logger, { LogOption } from "./logger";

interface ServiceOption {
  messager: IMessager;
  log?: LogOption;
  namespace?: string;
}

class WebService {
  private messager: IMessager;
  private listeners: Map<string, Array<MessageListener>> = new Map();
  private retryQueue: Array<Message> = [];
  private namespace: string;
  private logger: Logger;

  constructor(serviceOption: ServiceOption) {
    const { messager, log, namespace } = serviceOption;
    this.namespace = namespace;
    this.logger = new Logger(log, this.namespace);
    this.initMessager(messager);
  }

  private initMessager(messager: IMessager): void {
    this.messager = messager;

    this.messager.onReceiveMessage(this.handleReceiveMessage.bind(this));
    this.messager.onready = () => {
      this.startRetryRequest();
    };
  }

  // /**
  //  * 发现可用服务
  //  */
  // async fetchServices(): Promise<Array<string>> {
  //     const response  = await this.request({
  //         channel: this.messager.getCheckServiceType(),
  //     });
  //     this.services = response.data.body.functions;
  //     return this.services;
  // }

  // /**
  //  * 检测服务是否可用
  //  * @param {string} channel 服务类型
  //  *
  //  */
  // checkServiceAvailable(channel) {
  //     return this.services.indexOf(channel) !== -1;
  // }

  /**
   * 开始执行请求重发队列
   */
  startRetryRequest() {
    const retryQueue = this.retryQueue.slice();
    this.retryQueue = [];
    retryQueue.forEach((message) => {
      this.send(message);
    });
  }

  /**
   * 处理平台发送给webview的消息
   */
  handleReceiveMessage(message: Message) {
    const { channel, headers } = message;

    this.logger.logMessage("receive message", message);
    const eventListeners = this.listeners[channel];
    if (!eventListeners) {
      return;
    }

    const { reqId } = headers;
    const ctx = {
      ...message,
      end: (response: Message) => {
        merge(response, {
          headers: {
            reqId,
            mMode: "reply",
          },
          channel,
        });
        this.send(response);
      },
    };
    this._handleOnceListeners(eventListeners, ctx);
    this._handleNormalListeners(eventListeners, ctx);
  }

  /**
   * 处理一次性事件监听器（执行和移除）
   * @param {事件监听器数组} eventListeners
   * @param {消息上下文} ctx
   */
  _handleOnceListeners(eventListeners, ctx) {
    const { headers, data } = ctx;
    const { reqId } = headers;
    const onceListeners = remove(
      eventListeners,
      (listener: MessageListener) => {
        const isReqMatch =
          (listener.reqId && listener.reqId === reqId) || !listener.reqId;
        return listener.once && isReqMatch;
      }
    );

    onceListeners.forEach((listener) => {
      listener.callback && listener.callback(data, ctx);
    });
  }

  /**
   * 处理普通事件监听器（执行）
   * @param {事件监听器数组} eventListeners
   * @param {消息上下文} ctx
   */
  _handleNormalListeners(eventListeners, ctx) {
    const { headers, data } = ctx;
    const { reqId, mMode } = headers;
    if (mMode === "reply") {
      return;
    }
    eventListeners.forEach((listener) => {
      if (!listener.reqId) {
        listener.callback && listener.callback(data, ctx);
        return;
      }

      if (listener.reqId === reqId) {
        listener.callback && listener.callback(data, ctx);
      }
    });
  }

  /**
   * 发送消息
   * @param {object} config 请求信息
   */
  send(message: Message | string, body?: object): Message {
    let finalMessage = {
      channel: "",
      headers: { reqId: uuid(), mMode: "push" },
      data: {},
    };

    if (typeof message === "string") {
      merge(finalMessage, {
        channel: message,
        data: {
          body,
        },
      });
    } else {
      merge(finalMessage, message);
    }

    const { channel } = finalMessage;

    if (!channel) {
      console.error("[webService]message channel for sending is not supplied");
      return;
    }

    const isSuccess: boolean = this.messager.sendAction(finalMessage);
    if (!isSuccess) {
      this.retryQueue.push(finalMessage);
      this.logger.logMessage(
        `receiver is not ready, request will wait and resend`,
        finalMessage
      );
    } else {
      const onWebServiceExecOperation = globalThis["onWebServiceExecOperation"];
      onWebServiceExecOperation &&
        onWebServiceExecOperation(this, "sendAction", finalMessage);
      this.logger.logMessage("send message", finalMessage);
    }

    return finalMessage;
  }

  /**
   * 发起请求
   * @param {Message} message 请求信息
   * @return {Promise}
   */
  request(message: Message | string, body?: object): Promise<Message> {
    return new Promise((resolve, reject) => {
      let finalMessage;
      if (typeof message === "string") {
        finalMessage = {
          channel: message,
          data: {
            body,
          },
        };
      } else {
        finalMessage = message;
      }

      finalMessage.headers = {
        ...finalMessage.headers,
        mMode: "request",
      };
      const req = this.send(finalMessage);
      this.on(finalMessage.channel, {
        callback: (data: Message) => {
          resolve(data);
        },
        reqId: req.headers.reqId,
        once: true,
      });
    });
  }

  /**
   * 监听事件
   * @param {string} channel 监听的事件名称
   * @param {function} callback 监听器回调函数
   * @param {MessageListener} 完整监听器
   */
  on(channel: string, arg: Function | MessageListener) {
    if (!this.listeners[channel]) {
      this.listeners[channel] = [];
    }

    let messageListener: MessageListener;

    if (typeof arg === "function") {
      messageListener = {
        callback: arg,
        reqId: "",
        once: false,
      };
    } else {
      messageListener = arg;
    }

    this.listeners[channel].push(messageListener);

    const onWebServiceExecOperation = globalThis["onWebServiceExecOperation"];
    onWebServiceExecOperation &&
      onWebServiceExecOperation(this, "addListener", {
        channel,
        messageListener,
      });

    const unsubscribe = () => {
      this.off(channel, messageListener);
    };
    return unsubscribe;
  }

  /**
   * 移除事件监听器
   * @param {监听事件} channel
   * @param {监听器属性} messageListener 不传则移除对应事件全部监听器，可指定 callback 或 id 进行移除
   */
  off(channel: string, arg: Function | MessageListener) {
    if (!arg) {
      delete this.listeners[channel];
      return;
    }
    let messageListener;
    if (typeof arg === "function") {
      remove(this.listeners[channel], (listener: MessageListener) => {
        return listener.callback === arg;
      });
      messageListener = {
        callback: arg,
      };
    } else {
      const { callback, reqId } = arg;

      remove(this.listeners[channel], (listener: MessageListener) => {
        return (
          listener.callback === callback ||
          (listener.reqId && listener.reqId === reqId)
        );
      });
      messageListener = arg;
    }

    if (this.listeners[channel].length === 0) delete this.listeners[channel];

    const onWebServiceExecOperation = globalThis["onWebServiceExecOperation"];
    onWebServiceExecOperation &&
      onWebServiceExecOperation(this, "removeListener", {
        channel,
        messageListener,
      });
  }

  removeAllListeners() {
    this.listeners = new Map();
    const onWebServiceExecOperation = globalThis["onWebServiceExecOperation"];
    onWebServiceExecOperation &&
      onWebServiceExecOperation(this, "removeAllListener");
  }
}

export default WebService;
