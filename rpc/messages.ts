export interface EgressMessage<Method extends string = string, Params extends unknown[] = any[]>
  extends JsonRpcVersionBearer
{
  method: Method
  id: number | string
  params: Params
}

export type IngressMessage = OkMessage | ErrorMessage | NotificationMessage

export interface OkMessage<Result = any> extends JsonRpcVersionBearer {
  id: string
  result: Result
  params?: never
  error?: never
}

export interface ErrorMessage<
  Code extends number = number,
  Data = any,
> extends JsonRpcVersionBearer {
  id: string
  error: {
    code: Code
    message: string
    data: Data
  }
  params?: never
  result?: never
}

export interface NotificationMessage<Method extends string = string, Result = any>
  extends JsonRpcVersionBearer
{
  method: Method
  id?: never
  params: {
    subscription: string
    result: Result
  }
  result?: never
  error?: never
}

interface JsonRpcVersionBearer {
  jsonrpc: "2.0"
}

export function parse(raw: string) {
  // TODO
  return JSON.parse(raw)
}
