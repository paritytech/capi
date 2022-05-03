import { RpcClient, RpcClientFactory } from "./Base.ts";

export class RpcClientPool<Beacon> {
  #factory;
  #open = new Map<Beacon, {
    client: RpcClient;
    userCount: number;
  }>();

  constructor(factory: RpcClientFactory<Beacon>) {
    this.#factory = factory;
  }

  ref = async (beacon: Beacon): Promise<RpcClient> => {
    const openVal = this.#open.get(beacon);
    if (openVal) {
      openVal.userCount += 1;
      return openVal.client;
    }
    const client = await this.#factory(beacon);
    this.#open.set(beacon, {
      client,
      userCount: 1,
    });
    return client;
  };

  deref = async (beacon: Beacon): Promise<void> => {
    const openVal = this.#open.get(beacon);
    if (!openVal) {
      throw new Error();
    }
    openVal.userCount -= 1;
    if (openVal.userCount === 0) {
      this.#open.delete(beacon);
      await openVal.client.close();
    }
  };
}

export const rpcClientPool = <Beacon>(factory: RpcClientFactory<Beacon>) => {
  return new RpcClientPool(factory);
};
