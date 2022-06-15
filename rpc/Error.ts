// TODO: move provider-common error-related definitions from `messages.ts` into this very file!
import { ErrMessage } from "./messages.ts";

export type RpcError = RpcClientError | RpcServerError;

export abstract class RpcClientError extends Error {}

// TODO: when method-specific error narrowing becomes a priority, refactor such that RPC method types are accessible in `inner`.
export class RpcServerError extends Error {
  constructor(readonly inner: ErrMessage) {
    super();
  }
}
