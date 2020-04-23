
export interface Message {
    type:string,
    headers?: {
        reqId: string
    },
    data?: {
        code?:number,
        body?:object,
    }
}

/**
 * webview通讯器接口类
 */

interface IMessager {
    
    /**
     * 通讯通道初始化成功后回调
     */
    onready?: Function;
    /**
     * 发送消息接口
     */
    sendAction(message:Message):boolean;

    /**
     * 注入webservice事件处理回调
     * @param {function} cb 收到消息后web service的处理回调
     */
    onReceiveMessage(cb:Function):void;
    
    /**
     * 返回服务发现的命令类型
     */
    getCheckServiceType():string;
}

export default IMessager;