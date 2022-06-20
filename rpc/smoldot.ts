import type * as smoldot from "../_deps/smoldot.ts";
import { ErrorCtor } from "../util/mod.ts";
import * as B from "./Base.ts";
import { IngressMessage, InitMessage } from "./messages.ts";

export class SmoldotClient<M extends B.AnyMethods>
  extends B.Client<M, string, string, unknown, SmoldotInternalError>
{
  static #innerClient?: smoldot.Client;
  #chain?: smoldot.Chain;

  static #ensureInstance = async (): Promise<smoldot.Client | FailedToStartSmoldotError> => {
    if (!SmoldotClient.#innerClient) {
      try {
        const smoldot = await import("../_deps/smoldot.ts");
        SmoldotClient.#innerClient = smoldot.start();
      } catch (_e) {
        return new FailedToStartSmoldotError();
      }
    }
    return SmoldotClient.#innerClient;
  };

  static async open<M extends B.AnyMethods>(
    props: B.ClientProps<M, string, SmoldotInternalError>,
  ): Promise<SmoldotClient<M> | FailedToStartSmoldotError | FailedToAddChainError> {
    const inner = await SmoldotClient.#ensureInstance();
    if (inner instanceof Error) {
      return inner;
    }
    try {
      const client = new SmoldotClient(props);
      // TODO: wire up `onError`
      client.#chain = await inner.addChain({
        chainSpec: props.discoveryValue,
        jsonRpcCallback: client.onMessage,
      });
      return client;
    } catch (_e) {
      return new FailedToAddChainError();
    }
  }

  close = async (): Promise<undefined | FailedToRemoveChainError> => {
    try {
      this.#chain?.remove();
      return;
    } catch (e) {
      if (e instanceof Error) {
        // TODO: handle the following in a special manner?
        // - `AlreadyDestroyedError`
        // - `CrashError`
      }
      return new FailedToRemoveChainError();
    }
  };

  _send = (egressMessage: InitMessage<M>): void => {
    this.#chain?.sendJsonRpc(JSON.stringify(egressMessage));
  };

  parseIngressMessage = (
    rawIngressMessage: string,
  ): IngressMessage<M> | B.ParseRawIngressMessageError => {
    try {
      return JSON.parse(rawIngressMessage);
    } catch (_e) {
      return new B.ParseRawIngressMessageError();
    }
  };

  parseError = (_e: unknown): SmoldotInternalError => {
    return new SmoldotInternalError();
  };
}

export class FailedToStartSmoldotError extends ErrorCtor("FailedToStartSmoldot") {}
export class FailedToAddChainError extends ErrorCtor("FailedToAddChain") {}
export class SmoldotInternalError extends ErrorCtor("SmoldotInternal") {}
export class FailedToRemoveChainError extends ErrorCtor("FailedToRemoveChain") {}
