import { Client, RpcError } from "../../rpc/mod.ts";
import { effector } from "../impl/mod.ts";

export interface Pallet {
  rpc: Client<RpcError>;
  name: string;
}

export const pallet = effector.sync(
  "pallet",
  () =>
    (rpc: Client<RpcError>, name: string): Pallet => ({
      rpc,
      name,
    }),
);
