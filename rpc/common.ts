import { ErrorCtor } from "../util/mod.ts";
import * as msg from "./messages.ts";

export type ProviderMethods = Record<string, ProviderMethod<any[], any>>;
export type ProviderMethod<
  Params extends unknown[],
  Result extends unknown,
> = [params: Params, result: Result];
declare const subscription_: unique symbol;
export type Subscription<Notification = any> = { [subscription_]: Notification };

export interface Provider<
  M extends ProviderMethods,
  ParsedError extends Error,
  RawIngressMessage,
  RawError,
  CloseError extends Error,
> {
  parse: {
    /**
     * Parse messages returned from the RPC server (this includes RPC server errors)
     *
     * @param rawIngressMessage the raw response from the given provider, likely in need of some sanitization
     * @returns the sanitized ingress message, common to all providers
     */
    ingressMessage: (
      rawIngressMessage: RawIngressMessage,
    ) => msg.IngressMessage<M> | ParseRawIngressMessageError;
    /**
     * Parse errors of the given client, such as an error `Event` in the case of `WebSocket`s
     *
     * @param rawError the raw error from the given provider
     * @returns an instance of `RpcError`, typed via the client's sole generic type param
     */
    error: (rawError: RawError) => ParsedError | ParseRawErrorError;
  };
  /**
   * The provider-specific send implementation
   *
   * @param egressMessage the message you wish to send to the RPC server
   */
  send: (egressMessage: msg.InitMessage<M>) => void;
  // TODO: introduce `FailedToClose` error in the return type (union with `undefined`)
  /**
   * Close the connection and free up resources
   *
   * @returns a promise, which resolved to `undefined` upon successful cancellation
   */
  close: () => Promise<undefined | CloseError>;
}

export interface ClientHooks<
  M extends ProviderMethods,
  ParsedError extends Error,
> {
  send?: (message: msg.InitMessage<M>) => void;
  receive?: (message: msg.IngressMessage<M>) => void;
  error?: (error: ParseRawIngressMessageError | ParsedError | ParseRawErrorError) => void;
  close?: () => void;
}

export class ParseRawIngressMessageError extends ErrorCtor("ParseRawIngressMessage") {}
export class ParseRawErrorError extends ErrorCtor("ParseRawError") {}
