import WebService from '@easiclass/web-service';
import { iframeMessager, webviewMessager } from '@easiclass/messager';


class EclassWebService {

    createWebservice(messagerType) {
        switch(messagerType) {
            case 'iframe':
                return new WebService({ messager: iframeMessager });
            case 'webview':
                return new WebService({ messager: webviewMessager });
            default:
                break;
        }
    }
}

export default (messagerType) => {
    return new EclassWebService().createWebservice(messagerType);
}