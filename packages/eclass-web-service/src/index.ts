import WebService from '@sugarteam/web-service';
import { iframeMessager, webviewMessager } from '@sugarteam/web-messager';


class EclassWebService {

    constructor(messagerType: string) {
        if (!messagerType) {
            messagerType = window.parent === window ? 'webview' : 'iframe';
        }

        switch(messagerType) {
            case 'iframe':
                return new WebService({ messager: iframeMessager });
            case 'webview':
                return new WebService({ messager: webviewMessager })
        }
    }
}

let webService;
export default (messagerType) => {
    if (!webService) {
        return new EclassWebService(messagerType);
    } 
    return webService;
}