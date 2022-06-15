import { Smoldot } from "../_deps/smoldot.ts";
import { RpcClient, RpcClientFactory } from "./Base.ts";
import { RpcClientError } from "./Error.ts";
import { InitMessage } from "./messages.ts";

/** Be careful to only utilize methods once `openPending` is resolved */
export class SmoldotRpcClient extends RpcClient<SmoldotRpcClientError> {
  openPending;
  #chain!: Chain;

  constructor(readonly smoldotClient: SmoldotClient, readonly chainSpec: string) {
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

// Extract relevant types from `@substrate/smoldot-light`
type SmoldotClient = ReturnType<Smoldot["start"]>;
type Chain = Awaited<ReturnType<SmoldotClient["addChain"]>>;

export const smoldotRpcClientFactory = (() => {
  let smoldotClient: SmoldotClient;

  return (
    smoldotClientFactory: () => SmoldotClient,
  ): RpcClientFactory<string, SmoldotRpcClientError> => {
    if (!smoldotClient) {
      smoldotClient = smoldotClientFactory();
    }

    return async (chainSpec) => {
      const rpcClient = new SmoldotRpcClient(smoldotClient, chainSpec);
      await rpcClient.openPending;
      return rpcClient;
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
