import { RpcClient, RpcError } from "../../rpc/mod.ts";
import { effector } from "../impl/mod.ts";

export interface Pallet {
  rpc: RpcClient<RpcError>;
  name: string;
}

export const pallet = effector.sync(
  "pallet",
  () =>
    (rpc: RpcClient<RpcError>, name: string): Pallet => ({
      rpc,
      name,
    }),
);
