import { RpcClientFactory } from "/rpc/mod.ts";

export interface RpcClientFactoryRuntime<Beacon> {
  rpcClientFactory: RpcClientFactory<Beacon>;
}

export class RpcClientFactoryRuntimeError extends Error {}
