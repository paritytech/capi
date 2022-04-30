import { RpcClient, RpcClientFactory } from "./Base.ts";

export class RpcClientPool<Beacon> {
  #clients = new Map<Beacon, RpcClient>();

  constructor(readonly factory: RpcClientFactory<Beacon>) {}

  ref = async (beacon: Beacon): Promise<RpcClient> => {
    const existing = this.#clients.get(beacon);
    if (existing) {
      return existing;
    }
    const client = await this.factory(beacon, () => {
      this.#clients.delete(beacon);
    });
    this.#clients.set(beacon, client);
    return client;
  };
}

export const rpcClientPool = <Beacon>(factory: RpcClientFactory<Beacon>) => {
  return new RpcClientPool(factory);
};
