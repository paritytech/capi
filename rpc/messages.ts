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
  // TODO
  result: any;
  params?: never;
  error?: never;
}

export interface NotifMessage extends JsonRpcVersionBearer {
  method: string;
  id?: never;
  params: {
    subscription: string;
    // TODO
    result: any;
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
