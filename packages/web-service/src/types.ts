
export interface MessageListener {
    callback: Function,
    reqId:string,
    once:boolean
}