/**
 * eclass webview通讯器
 */

import IMessager from '@easiclass/web-service/IMessager';

const ECLASS_API = 'eclassExtends';
class Messager implements IMessager {
    private send: Function;
    public onready: Function;
    constructor(props) {   
    }

    onCreate() {
        if (!window[ECLASS_API]) {
            window[ECLASS_API] = {};
        } 

        Object.defineProperty(window[ECLASS_API], 'sendAction', {
            get: () => {
                return this.send;
            },
            set: (value) => {
                this.send = value;
                this.onready && this.onready();
            }
        })
    }

    getCheckServiceType() {
        return 'common.requestFunctions';
    }

    onReceiveMessage(messageHandler) {
        if (!window[ECLASS_API].callback) {
            window[ECLASS_API].callback = (jsonStr) => {
                const message = JSON.parse(jsonStr);
                messageHandler(message);
            };
        }
    }

    sendAction(message) {
        const jsonStr = JSON.stringify(message);
        window[ECLASS_API].sendAction && window[ECLASS_API].sendAction(jsonStr);
    }


}

export default new Messager()