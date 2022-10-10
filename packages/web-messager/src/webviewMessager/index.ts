/**
 * webview通讯器
 */

import IMessager from '../IMessager'

const WEBVIEW_API = 'webviewExtends'
class Messager implements IMessager {
  private send: Function
  public onready: Function
  constructor() {
    this.onCreate()
  }

  onCreate() {
    if (!window[WEBVIEW_API]) {
      window[WEBVIEW_API] = {}
    }

    if (!window[WEBVIEW_API]['sendAction']) {
      return
    }
    Object.defineProperty(window[WEBVIEW_API], 'sendAction', {
      get: () => {
        return this.send
      },
      set: (value) => {
        this.send = value
        this.onready && this.onready()
      },
    })
  }

  getCheckServiceType() {
    return 'common.requestFunctions'
  }

  onReceiveMessage(messageHandler) {
    if (!window[WEBVIEW_API].callback) {
      window[WEBVIEW_API].callback = (jsonStr) => {
        const message = JSON.parse(jsonStr)
        messageHandler(message)
      }
    }
  }

  sendAction(message) {
    const jsonStr = JSON.stringify(message)
    if (window[WEBVIEW_API].sendAction) {
      window[WEBVIEW_API].sendAction(jsonStr)
      return true
    } else {
      return false
    }
  }
}

export const webviewMessager = new Messager()
