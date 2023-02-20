export interface RpcEgressMessage extends RpcBaseMessage {
  id: number
  method: string
  params: unknown[]
}
export namespace RpcEgressMessage {
  export function fmt(id: number, method: string, params: unknown[]) {
    const message: RpcEgressMessage = {
      jsonrpc: "2.0",
      id,
      method,
      params,
    }
    return JSON.stringify(message)
  }
}

export type RpcIngressMessage = RpcOkMessage | RpcErrorMessage | RpcNotificationMessage

export type RpcCallMessage = RpcOkMessage | RpcErrorMessage
export type RpcSubscriptionMessage = RpcNotificationMessage | RpcErrorMessage

export type RpcSubscriptionHandler = (message: RpcSubscriptionMessage) => void

export interface RpcOkMessage extends RpcBaseMessage {
  id: number
  result: unknown
  params?: never
  error?: never
}

export interface RpcErrorMessage extends RpcBaseMessage {
  id: number
  error: {
    code: number
    message: string
    data: unknown
  }
  params?: never
  result?: never
}

export interface RpcNotificationMessage extends RpcBaseMessage {
  method: string
  id?: never
  params: {
    subscription: string
    result: unknown
  }
  result?: never
  error?: never
}

interface RpcBaseMessage {
  jsonrpc: "2.0"
}

export class ConnectionError extends Error {
  override readonly name = "ConnectionError"
}

export class ServerError extends Error {
  override readonly name = "ServerError"
  code
  data

  // TODO: accept init `EgressMessage`?
  constructor({ error: { code, data, message } }: RpcErrorMessage) {
    super(message, { cause: message })
    this.code = code
    this.data = data
  }
}
