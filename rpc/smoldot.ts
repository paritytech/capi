import { ListenerCb, RpcClient, RpcClientFactory, StopListening } from "./Base.ts";
import { Init } from "./messages.ts";

// TODO: error handling

// TODO: get this directly from smoldot
interface SmoldotClient {
  addChain(options: AddChainOptions): Promise<SmoldotChain>;
  terminate(): Promise<void>;
}
interface SmoldotChain {
  sendJsonRpc(rpc: string): void;
  remove(): void;
}
interface AddChainOptions {
  chainSpec: string;
  jsonRpcCallback?: (response: string) => void;
}

/** Be careful to only utilize methods once `openPending` is resolved */
export class SmoldotRpcClient extends RpcClient {
  openPending;
  #chain!: SmoldotChain;
  #listeners = new Map<ListenerCb, boolean>();

  constructor(readonly smoldotClient: SmoldotClient, readonly chainSpec: string) {
    super();
    this.openPending = smoldotClient
      .addChain({
        chainSpec,
        jsonRpcCallback: this.#onMessage,
      })
      .then((chain) => {
        this.#chain = chain;
      });
  }

  close = async (): Promise<void> => {
    this.#chain.remove();
  };

  listen = (listener: ListenerCb): StopListening => {
    if (this.#listeners.has(listener)) {
      throw new Error();
    }
    this.#listeners.set(listener, true);
    return () => {
      this.#listeners.delete(listener);
    };
  };

  send = (egressMessage: Init): void => {
    this.#chain.sendJsonRpc(JSON.stringify(egressMessage));
  };

  #onMessage = (m: string) => {
    console.log(JSON.parse(m));
  };
}

export const smoldotRpcClientFactory = (() => {
  let smoldotClient: SmoldotClient;

  return (smoldotClientFactory: () => SmoldotClient): RpcClientFactory<string> => {
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
