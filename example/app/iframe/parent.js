// import IframeWebService from '../../../packages/iframe-web-service'
import IframeWebService from '@codecapsule/iframe-web-service'
import { createBtn, sleep } from '../utils'

let iframeWebService
async function start() {
  console.log('parent start')
  const iframe = createChildIframe()
  initIframeWebService(iframe)
  initBtn()
}

function createChildIframe() {
  const iframe = document.createElement('iframe')
  iframe.src = 'http://localhost:8082'
  document.body.appendChild(iframe)
  console.log('iframe', iframe)
  return iframe
}

function initIframeWebService(childIframe) {
  iframeWebService = new IframeWebService({
    messagerType: 'parent',
    iframe: childIframe,
  })

  iframeWebService.on('childSendToParent', (message, ctx) => {
    console.log('message', message)
    console.log('ctx', ctx)
  })

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
}

function initBtn() {
  createBtn('send message to child', () => {
    // iframeWebService.send({
    //   channel: 'parentSendToChild',
    //   data: {
    //     body: {
    //       text: 'I am parent send',
    //     },
    //   },
    // })
    iframeWebService.send('parentSendToChild', {
      body: {
        text: 'I am parent send',
      },
    })
  })

  createBtn('request message to child', async () => {
    // const result = await iframeWebService.request({
    //   channel: 'requestToChild',
    //   data: {
    //     body: {
    //       text: 'I am parent request',
    //     },
    //   },
    // })
    const result = await iframeWebService.request('requestToChild', {
      body: {
        text: 'I am parent request',
      },
    })
    console.log('result', result)
  })
}

start()
