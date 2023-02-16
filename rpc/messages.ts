export interface RpcEgressMessage extends RpcVersionBearer, RpcMessageIdBearer {
  method: string
  params: any[]
}
export namespace RpcEgressMessage {
  export function fmt(id: RpcMessageId, method: string, params: unknown[]) {
    const message: RpcEgressMessage = {
      jsonrpc: "2.0",
      id,
      method,
      params,
    }
    return JSON.stringify(message)
  }
}

export type RpcHandler<Message extends RpcIngressMessage = RpcIngressMessage> = (
  message: Message,
) => void

export type RpcIngressMessage = RpcOkMessage | RpcErrorMessage | RpcNotificationMessage

export interface RpcOkMessage<OkData = any> extends RpcVersionBearer, RpcMessageIdBearer {
  result: OkData
  params?: never
  error?: never
}

export interface RpcErrorMessage<ErrorData extends RpcErrorMessageData = RpcErrorMessageData>
  extends RpcVersionBearer, RpcMessageIdBearer
{
  error: ErrorData
  params?: never
  result?: never
}
export interface RpcErrorMessageData<Code extends number = number, Data = any> {
  code: Code
  message: string
  data: Data
}

export interface RpcNotificationMessage<NotificationData = any> extends RpcVersionBearer {
  method: string // we could narrow, but it's not all that useful
  id?: never
  params: {
    subscription: string
    result: NotificationData
  }
  result?: never
  error?: never
}

export type RpcVersion = "2.0"
interface RpcVersionBearer {
  jsonrpc: RpcVersion
}

export type RpcMessageId = number | string
export interface RpcMessageIdBearer {
  id: RpcMessageId
}
