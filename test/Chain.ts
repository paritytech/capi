import { Beacon, beacon } from "../Beacon.ts";
import { Chain as Chain_ } from "../core/Chain.ts";
import { KnownRpcMethods } from "../known/mod.ts";
import { Addresses } from "./Addresses.ts";

export class Chain extends Chain_<Beacon<string, KnownRpcMethods>> {
  addresses: Addresses<this> = new Addresses(this);
}

export const templateChain = new Chain(beacon("wss://localhost:127.0.0.1:9933"));
