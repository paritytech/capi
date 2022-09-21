import { Config } from "../config/mod.ts";
import { ErrorCtor } from "../util/mod.ts";
import * as msg from "./messages.ts";

export type ProviderMethods = Record<string, (...args: any[]) => any>;
export type ErrorDetails = Record<string, [code: number, data?: any]>;

export interface Provider<
  Config_ extends Config,
  RawIngressMessage,
  SendError extends Error,
  CloseError extends Error,
> {
  /**
   * Parse messages returned from the RPC server (this includes RPC server errors)
   *
   * @param parseIngressMessage the raw response from the given provider, likely in need of some sanitization
   * @returns the sanitized ingress message, common to all providers
   */
  parseIngressMessage: (
    rawIngressMessage: RawIngressMessage,
  ) => msg.IngressMessage<Config_> | ParseRawIngressMessageError;
  /**
   * The provider-specific send implementation
   *
   * @param egressMessage the message you wish to send to the RPC server
   */
  send: (egressMessage: msg.InitMessage<Config_>) => void | SendError;
  // TODO: introduce `FailedToClose` error in the return type (union with `undefined`)
  /**
   * Close the connection and free up resources
   *
   * @returns a promise, which resolved to `undefined` upon successful cancellation
   */
  close: () => Promise<undefined | CloseError>;
}

export class ParseRawIngressMessageError extends ErrorCtor("ParseRawIngressMessage") {}

export class FailedToSendMessageError extends ErrorCtor("FailedToSendMessage") {
  constructor(readonly inner: unknown) {
    super();
  }
}
