import { Message } from './types';
/**
 * webview通讯器接口类
 */

interface IMessager {

    /**
     * 发送消息接口
     */
    sendAction(message:Message):void;

    /**
     * 注入webservice事件处理回调
     * @param {function} cb 收到消息后web service的处理回调
     */
    bindReceiveMessageHandler(cb:Function):void;
    
    /**
     * 返回服务发现的命令类型
     */
    getCheckServiceType():string;
}

export default IMessager;