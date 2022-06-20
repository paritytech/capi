import type * as smoldot from "../_deps/smoldot.ts";
import { ErrorCtor } from "../util/mod.ts";
import * as B from "./Base.ts";
import { IngressMessage, InitMessage } from "./messages.ts";
import { AnyMethods } from "./methods.ts";

export class SmoldotClient<Supported extends AnyMethods>
  extends B.Client<Supported, string, string, unknown, SmoldotInternalError>
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

  static async open<Supported extends AnyMethods>(
    props: B.ClientProps<Supported, string, SmoldotInternalError>,
  ): Promise<SmoldotClient<Supported> | FailedToStartSmoldotError | FailedToAddChainError> {
    const inner = await SmoldotClient.#ensureInstance();
    if (inner instanceof Error) {
      return inner;
    }
    try {
      const client = new SmoldotClient(props);
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

  send = (egressMessage: InitMessage<Supported>): void => {
    this.#chain?.sendJsonRpc(JSON.stringify(egressMessage));
  };

  parseIngressMessage = (
    rawIngressMessage: string,
  ): IngressMessage<Supported> | B.ParseRawIngressMessageError => {
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
