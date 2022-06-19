import type * as smoldot from "../_deps/smoldot.ts";
import { ErrorCtor } from "../util/mod.ts";
import * as B from "./Base.ts";
import * as M from "./messages.ts";

export class SmoldotRpcClient extends B.Client<string, string, unknown, SmoldotInternalError> {
  static #innerClient?: smoldot.Client;
  #chain?: smoldot.Chain;

  static #ensureInstance = async (): Promise<smoldot.Client | FailedToStartSmoldotError> => {
    if (!SmoldotRpcClient.#innerClient) {
      try {
        const smoldot = await import("../_deps/smoldot.ts");
        SmoldotRpcClient.#innerClient = smoldot.start();
      } catch (_e) {
        return new FailedToStartSmoldotError();
      }
    }
    return SmoldotRpcClient.#innerClient;
  };

  static async open(
    props: B.ClientProps<string, SmoldotInternalError>,
  ): Promise<SmoldotRpcClient | FailedToStartSmoldotError | FailedToAddChainError> {
    const inner = await SmoldotRpcClient.#ensureInstance();
    if (inner instanceof Error) {
      return inner;
    }
    try {
      const client = new SmoldotRpcClient(props);
      // TODO: wire up `onError`
      client.#chain = await inner.addChain({
        chainSpec: props.beacon,
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

  send = (egressMessage: M.InitMessage): void => {
    this.#chain?.sendJsonRpc(JSON.stringify(egressMessage));
  };

  parseIngressMessage = (
    rawIngressMessage: string,
  ): M.IngressMessage | B.ParseRawIngressMessageError => {
    try {
      return JSON.parse(rawIngressMessage);
    } catch (_e) {
      return new B.ParseRawIngressMessageError();
    }
  };

  parseError = (_e: unknown) => {
    return new SmoldotInternalError();
  };
}

export class FailedToStartSmoldotError extends ErrorCtor("FailedToStartSmoldot") {}
export class FailedToAddChainError extends ErrorCtor("FailedToAddChain") {}
export class SmoldotInternalError extends ErrorCtor("SmoldotInternal") {}
export class FailedToRemoveChainError extends ErrorCtor("FailedToRemoveChain") {}
