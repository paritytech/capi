import { RpcClientPool } from "/rpc/mod.ts";

export interface RpcClientPoolRuntime<Beacon> {
  rpcClientPool: RpcClientPool<Beacon>;
}

export class RpcClientPoolRuntimeError extends Error {}
