## 简介

基于 `js` 的消息通讯 `sdk`，包含通用消息服务 sdk、常见消息通讯器插件 sdk，使用 lerna 进行管理

1.  规范了消息协议
2.  提供请求响应式的 api
3.  提供了基本的 iframe 和 webview 通讯方式，支持通讯方式拓展

## iframe-web-service

用于`iframe`子窗口与父级窗口间通信的`SDK`。

引用：

```javascript
import IFrameWebService from '@codecapsule/iframe-web-service'
```

`IFrameWebService` 的 `props`:

```typescript
interface IFrameWebServiceProps {
  /**
   * 类型：'parent'父级窗口，'child'子级窗口(就是 iframe 的那个窗口)
   */
  messagerType: 'parent' | 'child'
  /**
   * 当 messagerType 是 'parent' 的时候，需要传递子窗口进来
   */
  iframe?: HTMLIFrameElement
}
```

### 子窗口使用（`iframe`的那个窗口）：

```javascript
import IFrameWebService from '@codecapsule/iframe-web-service'

// 需要指定 messagerType 为 'child'
const iframeWebService = new IframeWebService({ messagerType: 'child' })

// 推送消息
iframeWebService.send({
  type: 'childSendToParent',
  data: {
    body: {
      text: 'I am child send',
    },
  },
})

// 请求式
const result = await iframeWebService.request({
  type: 'requestToParent',
  data: {
    body: {
      text: 'I am child request',
    },
  },
})

// 监听消息
iframeWebService.on('parentSendToChild', (message, ctx) => {
  console.log('message', message)
  console.log('ctx', ctx)
})

// 父级窗口请求时，子级回复
iframeWebService.on('requestToChild', async (message, ctx) => {
  console.log('message', message)
  await sleep(3000)
  ctx.end({
    data: {
      code: 200,
      body: {
        text: 'I am child result',
      },
    },
  })
})

async function sleep(delay = 3000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}
```

### 父窗口使用（承载`iframe`的那个窗口）

```javascript
import IFrameWebService from '@codecapsule/iframe-web-service'

// 需要指定 messagerType 为 'parent'
// 同时需要传递子窗口的 iframe DOM 元素进来
iframeWebService = new IframeWebService({
  messagerType: 'parent',
  iframe: childIframe,
})

// 推送消息
iframeWebService.send({
  type: 'parentSendToChild',
  data: {
    body: {
      text: 'I am parent send',
    },
  },
})

// 请求消息
const result = await iframeWebService.request({
  type: 'requestToChild',
  data: {
    body: {
      text: 'I am parent request',
    },
  },
})

// 监听消息
iframeWebService.on('childSendToParent', (message, ctx) => {
  console.log('message', message)
  console.log('ctx', ctx)
})

// 子级窗口请求时，父级回复
iframeWebService.on('requestToParent', async (message, ctx) => {
  console.log('message', message)
  await sleep()
  ctx.end({
    data: {
      code: 200,
      body: {
        text: 'I am parent result',
      },
    },
  })
})

async function sleep(delay = 3000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}
```

## web-service

通用消息 sdk，不具有具体的通讯通道，需结合@codecapsule/web-messager 或自定义 messager 插件
下面描述如何自定义 webservice

### 自定义 messager.js

```javascript
class Messager {
  constructor(iframe) {
    this.iframe = iframe
  }

  getCheckServiceType() {
    return 'common.requestFunctions'
  }

  // 实现webservice如何去接收消息
  onReceiveMessage(messageHandler) {
    window.addEventListener('message', (e) => {
      e.data.headers && messageHandler(e.data)
    })
  }

  // 实现webservice如何去发送消息
  sendAction({ type, headers, data }) {
    this.iframe &&
      this.iframe.contentWindow.postMessage({ type, headers, data }, '*')
  }
}
```

## webservice 引入 messager

```javascript
import WebService from '@codecapsule/web-service'
import customMessager from './messager'

const iframeWebService = new WebService({ messager })

// 推送消息
iframeWebService.send({
  type: 'common.sayHello',
  data: {
    body: {
      name: 'mike',
    },
  },
})

// 请求式
const response = await iframeWebService.request({
  type: 'common.sayHello',
  data: {
    body: {
      name: 'mike',
    },
  },
})

// 监听消息
iframeWebService.on('common.requestName', (msg, ctx) => {
  // ctx中携带请求的信息，end 方法自动携带消息发起方的reqId和type进行回复
  ctx.end({
    data: {
      body: {
        name: 'luna',
      },
      code: 200,
    },
  })
})
```
