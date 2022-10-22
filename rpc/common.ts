import { ErrorCtor } from "../util/mod.ts";
import * as msg from "./messages.ts";

export type ProviderMethods = Record<string, (...args: any[]) => any>;
export type ErrorDetails = Record<string, [code: number, data?: any]>;

export interface Provider<
  RawIngressMessage,
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
  ) => msg.IngressMessage | ParseRawIngressMessageError;
  /**
   * The provider-specific send implementation
   *
   * @param egressMessage the message you wish to send to the RPC server
   */
  send: (egressMessage: msg.InitMessage) => void;
  // TODO: introduce `FailedToClose` error in the return type (union with `undefined`)
  /**
   * Close the connection and free up resources
   *
   * @returns a promise, which resolved to `undefined` upon successful cancellation
   */
  close: () => Promise<undefined | CloseError>;
}

export interface ClientHooks<InternalError> {
  send?: (message: msg.InitMessage) => void;
  receive?: (message: msg.IngressMessage) => void;
  error?: (error: ParseRawIngressMessageError | InternalError) => void;
  close?: () => void;
}

export class ParseRawIngressMessageError extends ErrorCtor("ParseRawIngressMessage") {}
