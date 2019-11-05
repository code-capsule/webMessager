/**
 * eclass webview通讯器
 */

import IMessager from '@easiclass/web-service/IMessager';

const ECLASS_API = 'eclassExtends';
class Messager implements IMessager {
    constructor() {
        this.onCreate();
    }

    onCreate() {
        if (!window[ECLASS_API]) {
            window[ECLASS_API] = {};
        } 
    }

    getCheckServiceType() {
        return 'common.requestFunctions';
    }

    bindReceiveMessageHandler(messageHandler) {
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