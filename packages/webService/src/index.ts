import uuid from 'uuid';
import { remove } from 'lodash';
import IMessager from './IMessager'; 
import { Message, MessageListener } from './types'

class WebService {
    private messager: IMessager;
    private listeners:Object;
    private services: Array<string>;
    constructor({ messager }) {
        this.init({ messager })
        this.listeners = {};
        this.services = [];
    }

    init({ messager }) {
        this.messager = messager;
        this.messager.bindReceiveMessageHandler(this.handleReceiveMessage.bind(this));
        setTimeout(() => {
            this.fetchServices();
        });
            
    }

    /**
     * 发现可用服务
     */
    async fetchServices() {
        const data  = await this.request({ 
            type: this.messager.getCheckServiceType(),
        });
        this.services = data.body.functions;
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
     * 处理平台发送给webview的消息
     */
    handleReceiveMessage(message: Message) {
        const {
            type,
            headers,
            data
        } = message;

        console.log('[webService]receive message', message);
        const eventListeners = this.listeners[type];
        if (!eventListeners) {
            return;
        }

        const { reqId } = headers;
        this._handleOnceListeners(eventListeners, reqId, data);
        this._handleNormalListeners(eventListeners, reqId, data);  
    }

    /**
     * 处理一次性事件监听器（执行和移除）
     * @param {事件监听器数组} eventListeners 
     * @param {需要匹配的reqId} reqId  不传则不考虑匹配reqId 
     */
    _handleOnceListeners(eventListeners, reqId, data) {
        const onceListeners = remove(eventListeners, (listener:MessageListener) => {
            const isReqMatch = (listener.reqId && listener.reqId === reqId) || !listener.reqId 
            return listener.once && isReqMatch;
        });

        onceListeners.forEach(listener => {
            listener.callback && listener.callback(data);
        })
    }

    
    /**
     * 处理普通事件监听器（执行）
     * @param {事件监听器数组} eventListeners 
     * @param {需要匹配的reqId} reqId  不传则不考虑匹配reqId 
     */
    _handleNormalListeners(eventListeners, reqId, data) {
        eventListeners.forEach(listener => {
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
        const finalMessage = {
            type,
            headers,
            data
        }
        
        this.messager.sendAction(finalMessage);
        console.log('[webService]send action', finalMessage);

        return finalMessage;
    }

    /**
     * 发起请求
     * @param {Message} message 请求信息
     * @return {Promise}
     */
    request(message: Message):Promise<object> {
        return new Promise((resolve, reject) => {
            const req = this.send(message);
            this.on(message.type, {
                callback: (data:object) => {
                    resolve(data)
                }, 
                reqId: req.headers.reqId,
                once: true 
            });
        })
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
    off(type, messageListener: MessageListener) {
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


