import { Config } from "../config/mod.ts";
import * as U from "../util/mod.ts";
import { ProviderMethods } from "./common.ts";

/** Ensure valid declaration of RPC method lookup (for both calls and subscriptions) */
export type EnsureMethods<Lookup extends Record<string, ProviderMethods>> = U.U2I<
  {
    [Prefix in keyof Lookup]: {
      [M in Extract<keyof Lookup[Prefix], string> as `${Extract<Prefix, string>}_${M}`]:
        Lookup[Prefix][M];
    };
  }[keyof Lookup]
>;

/** Ensure valid declaration of an RPC error detail lookup */
export type EnsureErrorDetails<Lookup extends Record<string, [code: number, data?: any]>> = Lookup;

/** Get a mapping from method name to init message */
export type InitMessageByMethodName<Config_ extends Config> = {
  [N in Extract<keyof Config_["RpcMethods"], string>]: InitMessageBase<
    N,
    Parameters<Config_["RpcMethods"][N]>
  >;
};

/** Get a union of init messages or––if `N` is supplied––a specific init message */
export type InitMessage<
  Config_ extends Config,
  N extends Extract<keyof Config_["RpcMethods"], string> = Extract<
    keyof Config_["RpcMethods"],
    string
  >,
> = InitMessageByMethodName<Config_>[N];

/** Get a mapping from method name to ok ingress message */
export type OkMessageByMethodName<Config_ extends Config> =
  & {
    [N in Extract<keyof Config_["RpcMethods"], string>]: OkMessageBase<
      ReturnType<Config["RpcMethods"][N]>
    >;
  }
  & { [N in keyof Config_["RpcSubscriptionMethods"]]: OkMessageBase<string> };

/** Get a ok ingress messages or––if `N` is supplied––a specific ok ingress message */
export type OkMessage<
  Config_ extends Config,
  N extends keyof OkMessageByMethodName<Config_> = keyof OkMessageByMethodName<Config_>,
> = OkMessageByMethodName<Config_>[N];

/** Get a mapping from method name to "notification" ingress message */
export type NotifByMethodName<Config_ extends Config> = {
  [N in Extract<keyof Config_["RpcSubscriptionMethods"], string>]: NotifMessageBase<
    N,
    ReturnType<Config_["RpcSubscriptionMethods"][N]>
  >;
};

/** Get a union of notification messages or––if `N` is supplied––a specific notification message */
export type NotifMessage<
  Config_ extends Config,
  N extends keyof NotifByMethodName<Config_> = keyof NotifByMethodName<Config_>,
> = NotifByMethodName<Config_>[N];

// TODO: investigate whether it's worthwhile to support somehow tacking on narrow method-specific types
/** Get a mapping from error name to error ingress message */
export type ErrMessageByName<Config_ extends Config> = {
  [N in keyof Config_["RpcErrorDetails"]]: ErrorMessageBase<
    Config_["RpcErrorDetails"][N][0],
    Config_["RpcErrorDetails"][N][1]
  >;
};

/** Get a union of error messages */
export type ErrMessage<Config_ extends Config> = U.ValueOf<ErrMessageByName<Config_>>;

export type IngressMessage<Config_ extends Config> =
  | OkMessage<Config_>
  | U.ValueOf<ErrMessageByName<Config_>> // ... for now
  | NotifMessage<Config_>;

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
    & (Data extends undefined ? Record<never, never> : {
      data: Data;
    });
  params?: never;
  result?: never;
}
