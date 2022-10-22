export type IngressMessage =
  | OkMessage
  | ErrMessage
  | NotifMessage;

interface JsonRpcVersionBearer {
  jsonrpc: "2.0";
}

export interface InitMessage extends JsonRpcVersionBearer {
  method: string;
  id: string;
  params: unknown[];
}

export interface OkMessage extends JsonRpcVersionBearer {
  id: string;
  result: unknown;
  params?: never;
  error?: never;
}

export interface NotifMessage extends JsonRpcVersionBearer {
  method: string;
  id?: never;
  params: {
    subscription: string;
    result: unknown;
  };
  result?: never;
  error?: never;
}

export interface ErrMessage extends JsonRpcVersionBearer {
  id: string;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
  params?: never;
  result?: never;
}
