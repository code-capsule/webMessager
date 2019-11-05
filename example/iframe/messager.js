class Messager  {
    constructor(iframe) {
        this.iframe = iframe;
    }

    getCheckServiceType() {
        return 'common.requestFunctions';
    }

    bindReceiveMessageHandler(messageHandler) {
       window.addEventListener('message', (e)=> {
           e.data.headers && messageHandler(e.data);
        }) 
    }

    sendAction({type, headers, data}) {
       this.iframe && this.iframe.contentWindow.postMessage({type, headers, data}, '*');
    }


}

export default new Messager()