import { EnsureLookup } from "../util/mod.ts";
import { SubscriptionIdString } from "../util/mod.ts";
import { Methods, Subscription } from "./methods.ts";

export type MethodName = keyof Methods;

export type InitMessageByMethodName = {
  [N in MethodName]: InitMessageBase<N, Parameters<Methods[N]>>;
};
export type InitMessage<N extends MethodName = MethodName> = InitMessageByMethodName[N];

export type OkMessageByMethodName = {
  [N in MethodName]: OkResBase<
    ReturnType<Methods[N]> extends Subscription ? string : ReturnType<Methods[N]>
  >;
};
export type OkMessage<N extends MethodName = MethodName> = OkMessageByMethodName[N];

export type NotifByMethodName = {
  [N in MethodName as ReturnType<Methods[N]> extends Subscription ? N : never]: NotifMessageBase<
    N,
    ReturnType<Methods[N]> extends Subscription<infer R> ? R : never
  >;
};
export type SubscriptionMethodName = keyof NotifByMethodName;
export type NotifMessage<N extends SubscriptionMethodName = SubscriptionMethodName> =
  NotifByMethodName[N];

// TODO: error matching utility / requires generalized we think through generalized matching utility
// TODO: investigate whether it's worthwhile to support somehow tacking on narrow method-specific types
export type ErrName = keyof ErrDetailLookup;
export type ErrMessageByName = {
  [N in ErrName]: ErrorMessageBase<ErrDetailLookup[N][0], ErrDetailLookup[N][1]>;
};
export type ErrMessage<N extends ErrName = ErrName> = ErrMessageByName[N];

export type IngressMessage<M extends MethodName = MethodName> =
  | OkMessage<M>
  | ErrMessage
  | NotifMessage<Extract<M, SubscriptionMethodName>>;

type ErrDetailLookup = EnsureLookup<string, [code: number, data?: any], {
  /**
   * Invalid JSON was received by the server.
   */
  ParseError: [-32700];
  /**
   * The JSON sent is not a valid Request object.
   */
  InvalidRequest: [-32600];
  /**
   * The method does not exist / is not available.
   */
  MethodNotFound: [-32601];
  /**
   * Invalid method parameter(s).
   */
  InvalidParams: [-32602];
  /**
   * Internal JSON-RPC error.
   */
  InternalError: [-32603];
  /**
   * Other internal server error.
   * Contains a more precise error code and a custom message.
   * Error code must be in the range -32000 to -32099 included.
   */
  ServerError: [number];
  /**
   * Method-specific error.
   * Contains a more precise error code and a custom message.
   * Error code must be outside of the range -32000 to -32700.
   */
  MethodError: [number];
}>;

interface JsonRpcVersionBearer {
  jsonrpc: "2.0";
}

export interface InitMessageBase<Method extends MethodName, Params extends unknown[]>
  extends JsonRpcVersionBearer
{
  method: Method;
  id: string;
  params: Params;
}

export interface OkResBase<Result> extends JsonRpcVersionBearer {
  id: string;
  result: Result;
  params?: never;
  error?: never;
}

export interface NotifMessageBase<Method extends MethodName, Result> extends JsonRpcVersionBearer {
  method: Method;
  id?: never;
  params: {
    subscription: SubscriptionIdString;
    result: Result;
  };
  result?: never;
  error?: never;
}

interface ErrorMessageBase<
  Code extends number,
  Data = undefined,
> extends JsonRpcVersionBearer {
  id: string;
  error:
    & {
      code: Code;
      message: string;
    }
    & (Data extends undefined ? {} : {
      data: Data;
    });
  params?: never;
  result?: never;
}
