/**
 * iframe 的父级通讯器
 */
import IMessager from '../../IMessager'

interface IProps {
  iframe: HTMLIFrameElement
}

class ParentIframeMessager implements IMessager {
  private iframe: HTMLIFrameElement
  constructor() {}

  setIframe(iframe) {
    this.iframe = iframe
  }

  getCheckServiceType() {
    return 'common.requestFunctions'
  }

  onReceiveMessage(messageHandler) {
    window.addEventListener('message', (e) => {
      e.data.headers && messageHandler(e.data)
    })
  }

  sendAction({ type, headers, data }) {
    window.parent === window &&
      this.iframe.contentWindow.postMessage({ type, headers, data }, '*')
    return true
  }
}

export const parentIframeMessager = new ParentIframeMessager()
