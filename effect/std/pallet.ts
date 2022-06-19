import { AnyClient } from "../../rpc/mod.ts";
import { effector } from "../impl/mod.ts";

export interface Pallet {
  rpc: AnyClient;
  name: string;
}

export const pallet = effector.sync(
  "pallet",
  () =>
    (rpc: AnyClient, name: string): Pallet => ({
      rpc,
      name,
    }),
);
