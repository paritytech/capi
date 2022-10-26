export interface Egress<Method extends string = string, Params extends unknown[] = any[]>
  extends JsonRpcVersionBearer
{
  method: Method;
  id: string;
  params: Params;
}

export type Ingress = Ok | Err | Notif;

export interface Ok<Result = any> extends JsonRpcVersionBearer {
  id: string;
  result: Result;
  params?: never;
  error?: never;
}

export interface Err<Data = any> extends JsonRpcVersionBearer {
  id: string;
  error: {
    code: number;
    message: string;
    data: Data;
  };
  params?: never;
  result?: never;
}

export interface Notif<Method extends string = string, Result = any> extends JsonRpcVersionBearer {
  method: Method;
  id?: never;
  params: {
    subscription: string;
    result: Result;
  };
  result?: never;
  error?: never;
}

interface JsonRpcVersionBearer {
  jsonrpc: "2.0";
}

export function parse(raw: string) {
  // TODO
  return JSON.parse(raw);
}
