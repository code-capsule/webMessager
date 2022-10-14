/**
 * 子 iframe 通讯器
 */

import IMessager from '../../IMessager'
class ChildIframeMessagerConstructor implements IMessager {
  constructor() {}

  getCheckServiceType() {
    return 'common.requestFunctions'
  }

  onReceiveMessage(messageHandler) {
    window.addEventListener('message', (e) => {
      e.data.headers && messageHandler(e.data)
    })
  }

  sendAction({ channel, headers, data }) {
    window.parent !== window &&
      window.parent.postMessage({ channel, headers, data }, '*')
    return true
  }
}

export const ChildIframeMessager = ChildIframeMessagerConstructor
