import * as U from "../util/mod.ts";
import { ProviderMethods, Subscription } from "./common.ts";

export type InitMessageByMethodName<M extends ProviderMethods> = {
  [N in keyof M]: InitMessageBase<U.AssertT<N, string>, M[N][0]>;
};
export type InitMessage<
  M extends ProviderMethods,
  N extends keyof M = keyof M,
> = InitMessageByMethodName<M>[N];

export type Params<M extends ProviderMethods, N extends keyof M> = M[N][0];

export type OkMessageByMethodName<M extends ProviderMethods> = {
  [N in keyof M]: OkMessageBase<M[N][1] extends Subscription ? string : M[N][1]>;
};
export type OkMessage<
  M extends ProviderMethods,
  N extends keyof M = keyof M,
> = OkMessageByMethodName<M>[N];

export type NotifByMethodName<M extends ProviderMethods> = {
  [N in keyof M as M[N][1] extends Subscription ? N : never]: NotifMessageBase<
    U.AssertT<N, string>,
    M[N][1] extends Subscription<infer R> ? R : never
  >;
};
export type SubscriptionMethodName<M extends ProviderMethods> = keyof NotifByMethodName<M>;
export type NotifMessage<
  M extends ProviderMethods,
  N extends SubscriptionMethodName<M> = SubscriptionMethodName<M>,
> = NotifByMethodName<M>[N];

// TODO: investigate whether it's worthwhile to support somehow tacking on narrow method-specific types
export type ErrName = keyof ErrDetailLookup;
export type ErrMessageByName = {
  [N in ErrName]: ErrorMessageBase<ErrDetailLookup[N][0], ErrDetailLookup[N][1]>;
};
export type ErrMessage<N extends ErrName = ErrName> = ErrMessageByName[N];

export type IngressMessage<
  M extends ProviderMethods,
  N extends keyof M = keyof M,
> =
  | OkMessage<M, N>
  | ErrMessage
  | (N extends SubscriptionMethodName<M> ? NotifMessage<M, N> : never);

type ErrDetailLookup = U.EnsureLookup<string, [code: number, data?: any], {
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

export interface InitMessageBase<Method extends string, Params extends unknown[]>
  extends JsonRpcVersionBearer
{
  method: Method;
  id: string;
  params: Params;
}

export interface OkMessageBase<Result> extends JsonRpcVersionBearer {
  id: string;
  result: Result;
  params?: never;
  error?: never;
}

export interface NotifMessageBase<Method extends string, Result> extends JsonRpcVersionBearer {
  method: Method;
  id?: never;
  params: {
    subscription: U.SubscriptionIdString;
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
