import WebService from '@codecapsule/web-service'
import {
  ParentIframeMessager,
  ChildIframeMessager,
} from '@codecapsule/web-messager'

export interface IFrameWebServiceProps {
  /**
   * 类型：'parent'父级窗口，'child'子级窗口(就是 iframe 的那个窗口)
   */
  messagerType: 'parent' | 'child'
  /**
   * 当 messagerType 是 'parent' 的时候，需要传递子窗口进来
   */
  iframe?: HTMLIFrameElement
}

class IFrameWebService {
  constructor(props: IFrameWebServiceProps) {
    const { messagerType, iframe } = props
    switch (messagerType) {
      case 'parent':
        const parentIframeMessager = new ParentIframeMessager({ iframe })
        return new WebService({ messager: parentIframeMessager })
      case 'child':
        const childIframeMessager = new ChildIframeMessager()
        return new WebService({ messager: childIframeMessager })
    }
  }
}

let webService
export default (props: IFrameWebServiceProps) => {
  if (!webService) {
    return new IFrameWebService(props)
  }
  return webService
}
