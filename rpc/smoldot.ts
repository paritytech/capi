import type * as smoldot from "../_deps/smoldot.ts";
import { RpcClient } from "./Base.ts";
import { RpcClientError } from "./Error.ts";
import { InitMessage } from "./messages.ts";

/** Be careful to only utilize methods once `openPending` is resolved */
export class SmoldotRpcClient extends RpcClient<SmoldotRpcClientError> {
  openPending;
  #chain!: smoldot.Chain;

  constructor(readonly smoldotClient: smoldot.Client, readonly chainSpec: string) {
    super();
    this.openPending = smoldotClient
      .addChain({
        chainSpec,
        jsonRpcCallback: this.onMessage,
      })
      .then((chain) => {
        this.#chain = chain;
      })
      .catch(() => {
        // TODO: parameterize error / supply better message
        this.onError(new SmoldotRpcClientError.FailedToInitialize());
      });
  }

  async opening(): Promise<void> {
    await this.openPending;
  }

  close = async (): Promise<void> => {
    this.#chain.remove();
  };

  send = (egressMessage: InitMessage): void => {
    this.#chain.sendJsonRpc(JSON.stringify(egressMessage));
  };

  parseMessage = (m: unknown) => {
    if (typeof m !== "string") {
      this.onError(new SmoldotRpcClientError.FailedToParse());
      return;
    }
    return JSON.parse(m);
  };

  parseError = (_e: unknown) => {
    return new SmoldotRpcClientError.Internal();
  };
}

export const smoldotRpcClientFactory = (() => {
  let smoldotClient: smoldot.Client;
  return (start: () => smoldot.Client) => {
    if (!smoldotClient) smoldotClient = start();
    // TODO: accept branded type
    return async (chainSpec: string) => {
      const client = new SmoldotRpcClient(smoldotClient, chainSpec);
      await client.openPending;
      return client;
    };
  };
})();

export type SmoldotRpcClientError =
  | SmoldotRpcClientError.FailedToInitialize
  | SmoldotRpcClientError.FailedToParse
  | SmoldotRpcClientError.Internal;
export namespace SmoldotRpcClientError {
  export class FailedToInitialize extends RpcClientError {}
  export class FailedToParse extends RpcClientError {}
  export class Internal extends RpcClientError {}
}
