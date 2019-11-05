export interface Message {
    type:string,
    headers?: {
        reqId: string
    },
    data?: {
        code?:number,
        body?:object,
    }
}

export interface MessageListener {
    callback: Function,
    reqId:string,
    once:boolean
}