## 简介
基于js的消息通讯sdk，包含易课堂消息sdk、通用消息服务sdk、常见消息通讯器插件sdk，使用lerna进行管理
 

1.  规范了消息协议
2.  提供请求响应式的api
3.  提供了基本的iframe和webview通讯方式，支持插件式拓展


## Eclass-web-service
易课堂消息sdk

```
import EclassWebService from "@easiclass/eclass-web-service";

// 不指定类型将自动判断环境
const iframeWebService = new EclassWebService('iframe');
// 推送消息
iframeWebService.send({
    type: 'common.sayHello',
    data: {
        body: {
            name: 'mike'
        }
    }
   
})

// 请求式
const response = await iframeWebService.request({
    type: 'common.sayHello',
    data: {
        body: {
            name: 'mike'
        }
    }
});

// 监听消息
iframeWebService.on('common.requestName', (msg, ctx) => {
    // ctx中携带请求的信息，end 方法自动携带消息发起方的reqId和type进行回复
    ctx.end({
        data: {
            body: {
                name: 'luna'
            },
            code: 200
        }
    })
});
```

## web-service
通用消息sdk，不具有具体的通讯通道，需结合@easiclass/web-messager或自定义messager插件（见eclass-web-serice的实现）
下面描述如何自定义webservice


### 自定义messager.js
```
class Messager  {
    constructor(iframe) {
        this.iframe = iframe;
    }


    getCheckServiceType() {
        return 'common.requestFunctions';
    }

    // 实现webservice如何去接收消息
    onReceiveMessage(messageHandler) {
       window.addEventListener('message', (e)=> {
           e.data.headers && messageHandler(e.data);
        }) 
    }
    
    // 实现webservice如何去发送消息
    sendAction({type, headers, data}) {
       this.iframe && this.iframe.contentWindow.postMessage({type, headers, data}, '*');
    }


}

```

## webservice引入messager
```
import WebService from "@easiclass/web-service";
import customMessager from "./messager";

const iframeWebService = new WebService({ messager });

// 推送消息
iframeWebService.send({
    type: 'common.sayHello',
    data: {
        body: {
            name: 'mike'
        }
    }
   
})


// 请求式
const response = await iframeWebService.request({
    type: 'common.sayHello',
    data: {
        body: {
            name: 'mike'
        }
    }
});


// 监听消息
iframeWebService.on('common.requestName', (msg, ctx) => {

    // ctx中携带请求的信息，end 方法自动携带消息发起方的reqId和type进行回复
    ctx.end({
        data: {
            body: {
                name: 'luna'
            },
            code: 200
        }
    })
});

    
```