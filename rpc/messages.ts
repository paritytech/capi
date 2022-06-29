import { AnyMethods, EnsureLookup } from "../util/mod.ts";
import { SubscriptionIdString } from "../util/mod.ts";
import { SubscriptionBrand } from "./Base.ts";

export type InitMessageByMethodName<M extends AnyMethods> = {
  [N in keyof M]: InitMessageBase<M, N, Parameters<M[N]>>;
};
export type InitMessage<
  M extends AnyMethods,
  N extends keyof M = keyof M,
> = InitMessageByMethodName<M>[N];

export type OkMessageByMethodName<M extends AnyMethods> = {
  [N in keyof M]: OkResBase<ReturnType<M[N]> extends SubscriptionBrand ? string : ReturnType<M[N]>>;
};
export type OkMessage<
  M extends AnyMethods,
  N extends keyof M = keyof M,
> = OkMessageByMethodName<M>[N];

export type NotifByMethodName<M extends AnyMethods> = {
  [N in keyof M as ReturnType<M[N]> extends SubscriptionBrand ? N : never]: NotifMessageBase<
    M,
    N,
    ReturnType<M[N]> extends SubscriptionBrand<infer R> ? R : never
  >;
};
export type SubscriptionMethodName<M extends AnyMethods> = keyof NotifByMethodName<M>;
export type NotifMessage<
  M extends AnyMethods,
  N extends SubscriptionMethodName<M> = SubscriptionMethodName<M>,
> = NotifByMethodName<M>[N];

// TODO: investigate whether it's worthwhile to support somehow tacking on narrow method-specific types
export type ErrName = keyof ErrDetailLookup;
export type ErrMessageByName = {
  [N in ErrName]: ErrorMessageBase<ErrDetailLookup[N][0], ErrDetailLookup[N][1]>;
};
export type ErrMessage<N extends ErrName = ErrName> = ErrMessageByName[N];

export type IngressMessage<
  M extends AnyMethods,
  N extends keyof M = keyof M,
> =
  | OkMessage<M, N>
  | ErrMessage
  | (N extends SubscriptionMethodName<M> ? NotifMessage<M, N> : never);

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

export interface InitMessageBase<
  M extends AnyMethods,
  Method extends keyof M,
  Params extends unknown[],
> extends JsonRpcVersionBearer {
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

export interface NotifMessageBase<
  M extends AnyMethods,
  Method extends keyof M,
  Result,
> extends JsonRpcVersionBearer {
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
