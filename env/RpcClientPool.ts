import { RpcClientFactory } from "/rpc/mod.ts";

export interface RpcClientFactoryR<Beacon> {
  rpcClientFactory: RpcClientFactory<Beacon>;
}
