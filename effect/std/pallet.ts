import { effector } from "/effect/Effect.ts";
import { RpcClient } from "/rpc/mod.ts";

export interface Pallet {
  rpc: RpcClient;
  name: string;
}

export const pallet = effector.sync("pallet", () =>
  (rpc: RpcClient, name: string): Pallet => ({
    rpc,
    name,
  }));
