// import IframeWebService from '../../../packages/iframe-web-service'
import IframeWebService from '@codecapsule/iframe-web-service'
import { createBtn, sleep } from '../utils'

let iframeWebService
async function start() {
  console.log('child start')
  initIframeWebService()
  initBtn()
}

function initIframeWebService() {
  iframeWebService = new IframeWebService({ messagerType: 'child' })
  iframeWebService.on('parentSendToChild', (message, ctx) => {
    console.log('message', message)
    console.log('ctx', ctx)
  })

  iframeWebService.on('requestToChild', async (message, ctx) => {
    console.log('message', message)
    await sleep()
    ctx.end({
      data: {
        code: 200,
        body: {
          text: 'I am child result',
        },
      },
    })
  })
}

function initBtn() {
  createBtn('send message to parent', () => {
    iframeWebService.send({
      type: 'childSendToParent',
      data: {
        body: {
          text: 'I am child send',
        },
      },
    })
  })

  createBtn('request message to parent', async () => {
    const result = await iframeWebService.request({
      type: 'requestToParent',
      data: {
        body: {
          text: 'I am child request',
        },
      },
    })
    console.log('result', result)
  })
}

start()
