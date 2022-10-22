export type IngressMessage =
  | OkMessage
  | ErrMessage
  | NotifMessage;

interface JsonRpcVersionBearer {
  jsonrpc: "2.0";
}

export interface InitMessage<Params extends unknown[] = any[]> extends JsonRpcVersionBearer {
  method: string;
  id: string;
  params: Params;
}

export interface OkMessage<Result = any> extends JsonRpcVersionBearer {
  id: string;
  result: Result;
  params?: never;
  error?: never;
}

export interface NotifMessage<Result = any> extends JsonRpcVersionBearer {
  method: string;
  id?: never;
  params: {
    subscription: string;
    result: Result;
  };
  result?: never;
  error?: never;
}

export interface ErrMessage extends JsonRpcVersionBearer {
  id: string;
  error: {
    code: number;
    message: string;
    // TODO
    data?: any;
  };
  params?: never;
  result?: never;
}
