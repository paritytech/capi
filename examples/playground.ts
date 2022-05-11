import { MOONBEAM_RPC_URL } from "/_/constants/chains/url.ts";
import * as c from "/effect/mod.ts";

const system = c
  .pallet(MOONBEAM_RPC_URL, "System")
  .entry("Account")
  .read();
console.log(system);
