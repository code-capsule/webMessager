import WebService from "@easiclass/web-service";
import messager from './messager';

function init() {
    const iframeWebService = new WebService({ messager });
    iframeWebService.on('common.requestFunctions', () => {
        iframeWebService.send({
            type:'common.requestFunctions',
            data: {
                body: {
                    functions: ['common.requestFunctions']
                }
            }
        })
    });
}

init();