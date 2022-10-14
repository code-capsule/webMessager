/**
 * iframe 的父级通讯器
 */
import IMessager from '../../IMessager'

interface IProps {
  iframe: HTMLIFrameElement
}

class ParentIframeMessagerConstructor implements IMessager {
  private iframe: HTMLIFrameElement
  constructor(props: IProps) {
    this.iframe = props.iframe
  }

  getCheckServiceType() {
    return 'common.requestFunctions'
  }

  onReceiveMessage(messageHandler) {
    window.addEventListener('message', (e) => {
      e.data.headers && messageHandler(e.data)
    })
  }

  sendAction({ channel, headers, data }) {
    window.parent === window &&
      this.iframe.contentWindow.postMessage({ channel, headers, data }, '*')
    return true
  }
}

export const ParentIframeMessager = ParentIframeMessagerConstructor
