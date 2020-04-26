import uuid from 'uuid';
import { remove, merge } from 'lodash';
import { IMessager, Message } from '@student/web-messager'; 
import { MessageListener } from './types';

interface ServiceOption {
    messager: IMessager
}
class WebService {
    private messager: IMessager;
    private listeners: Array<MessageListener> = [];
    private services: Array<string> = [];
    private retryQueue: Array<Message> = [];

    constructor(serviceOption: ServiceOption) {
        const { messager } = serviceOption;
        this.initMessager(messager)
    }

    private initMessager(messager: IMessager): void {
        this.messager = messager;

        this.messager.onReceiveMessage(this.handleReceiveMessage.bind(this));
        this.messager.onready = () => {
            this.startRetryRequest();
        }
        
        this.fetchServices();
            
    }

    /**
     * 发现可用服务
     */
    async fetchServices(): Promise<Array<string>> {
        const response  = await this.request({ 
            type: this.messager.getCheckServiceType(),
        });
        this.services = response.data.body.functions;
        return this.services;
    }

    /**
     * 检测服务是否可用
     * @param {string} type 服务类型
     *  
     */
    checkServiceAvailable(type) {
        return this.services.indexOf(type) !== -1;
    }

    /**
     * 开始执行请求重发队列
     */
    startRetryRequest() {
        const retryQueue = this.retryQueue.slice();
        this.retryQueue = [];
        retryQueue.forEach(message => {
            this.send(message);
        })
    }

    /**
     * 处理平台发送给webview的消息
     */
    handleReceiveMessage(message: Message) {
        const {
            type,
            headers,
        } = message;

        console.log('[webService]receive message', message);
        const eventListeners = this.listeners[type];
        if (!eventListeners) {
            return;
        }

        const { reqId } = headers;
        const ctx = {
            ...message,
            end: (response: Message) => {
                merge(response, {
                    headers: {
                        reqId
                    },
                    type
                });
                this.send(response);
            }
        }
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
        const onceListeners = remove(eventListeners, (listener:MessageListener) => {
            const isReqMatch = (listener.reqId && listener.reqId === reqId) || !listener.reqId 
            return listener.once && isReqMatch;
        });

        onceListeners.forEach(listener => {
            listener.callback && listener.callback(data, ctx);
        })
    }

    
    /**
     * 处理普通事件监听器（执行）
     * @param {事件监听器数组} eventListeners 
     * @param {消息上下文} ctx
     */
    _handleNormalListeners(eventListeners, ctx) {
        const { headers, data } = ctx;
        const { reqId } = headers;
        eventListeners.forEach(listener => {
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
    send(message: Message):Message {
        const { 
            type,
            headers = { reqId: uuid() }, 
            data = {}
        } = message; 

        if (!type) {
            console.error('type is not supplied');
            return;
        }
        
        if (!headers.reqId) {
            headers.reqId = uuid();
        }
        const isSuccess: boolean = this.messager.sendAction({type, headers, data});
        if (!isSuccess) {
            this.retryQueue.push({type, headers, data});
            console.log('[webservice]client is not ready, request wait for sending', {type, headers, data});
        } else {
            console.log('[webService]send action', {type, headers, data});
        }

        return {type, headers, data};
    }

    /**
     * 发起请求
     * @param {Message} message 请求信息
     * @return {Promise}
     */
    request(message: Message):Promise<Message> {
        return new Promise((resolve, reject) => {
            const req = this.send(message);
            this.on(message.type, {
                callback: (data:Message) => {
                    resolve(data)
                }, 
                reqId: req.headers.reqId,
                once: true 
            });
        })
    }

    /**
     * 监听请求类型的消息，并回复
     * @param {string} type 监听事件类型 
     * @param {function} callback 监听器回调函数
     * @param {MessageListener} 完整监听器
     */
    response(type:string, arg: Function | MessageListener) {
        if(!this.listeners[type]) {
            this.listeners[type] = [];
        }

        let messageListener: MessageListener;

        if (typeof arg === 'function') {
            messageListener = {
                callback: arg,
                reqId: '',
                once: false
            }
        } else {
            messageListener = arg
        }
        

        this.listeners[type].push(messageListener);
    }
    
    /**
     * 监听事件
     * @param {string} type 监听事件类型 
     * @param {function} callback 监听器回调函数
     * @param {MessageListener} 完整监听器
     */
    on(type:string, arg: Function | MessageListener) {
        if(!this.listeners[type]) {
            this.listeners[type] = [];
        }

        let messageListener: MessageListener;

        if (typeof arg === 'function') {
            messageListener = {
                callback: arg,
                reqId: '',
                once: false
            }
        } else {
            messageListener = arg
        }
        

        this.listeners[type].push(messageListener);
    }

    /**
     * 移除事件监听器
     * @param {监听事件类型} type 
     * @param {监听器属性} messageListener 不传则移除对应事件全部监听器，可指定 callback 或 id 进行移除
     */
    off(type: string, messageListener: MessageListener) {
        if (!messageListener) {
            delete this.listeners[type];
        }

        const { callback, reqId } = messageListener;

        remove(this.listeners[type], (listener:MessageListener) => {
            return  listener.callback === callback || (listener.reqId && listener.reqId === reqId);
        })
    }


}

export default WebService;


