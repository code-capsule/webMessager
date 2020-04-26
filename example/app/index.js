import EclassWebService from "@student/eclass-web-service";
import WebService from "@student/web-service";
import customMessager from "./messager"; 

// 使用eclass内置iframe、webview通讯机制
async function start() {
    // 使用自定义messager的 webservice
    // const iframeWebService = new WebService({ messager });

    // 使用eclass内置iframe、webview通讯机制
    const iframeWebService = new EclassWebService('iframe');



    iframeWebService.on('common.requestName', (msg, ctx) => {
        console.log('receive msg ', msg);
        // end 方法自动携带消息发起方的reqId和type进行回复
        ctx.end({
            data: {
                body: {
                    name: 'luna'
                },
                code: 200
            }
        })
    });

    // 测试另一端发起消息
    setTimeout(()=>{
        window.postMessage({
            type: 'common.sayHello',
            data: {
                body: {
                    name: 'luna'
                },
                code: 200
            },
            headers: {
                reqId: 'aaa'
            }
        })
    }, 500)
        
    
    const response = await iframeWebService.request({
        type: 'common.sayHello',
        data: {
            body: {
                name: 'mike'
            }
        },
        // 测试用，reqid可以不手动指定
        headers: {
            reqId: 'aaa'
        }
    });

    console.log('response', response);
}

start();
