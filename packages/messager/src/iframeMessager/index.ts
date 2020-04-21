/**
 * eclass webview通讯器
 */

 import IMessager from '@easiclass/web-service/IMessager';
 class Messager implements IMessager {
     constructor() {}
 
     getCheckServiceType() {
         return 'common.requestFunctions';
     }
 
     onReceiveMessage(messageHandler) {
        window.addEventListener('message', (e)=> {
            e.data.headers && messageHandler(e.data);
         }) 
     }
 
     sendAction({type, headers, data}) {
        window.parent !== window && window.parent.postMessage({type, headers, data}, '*');
        return true;
     }
 
 
 }
 
 export default new Messager()