import { beacon } from "../rpc/mod.ts";
import { KnownRpcMethods } from "./methods.ts";

// TODO: swap out `KnownRpcMethods` with narrowed lookups
export const acalaBeacon = beacon<KnownRpcMethods>(
  "wss://acala-polkadot.api.onfinality.io/public-ws",
);
export const kusamaBeacon = beacon<KnownRpcMethods>("wss://kusama-rpc.polkadot.io");
export const moonbeamBeacon = beacon<KnownRpcMethods>("wss://wss.api.moonbeam.network");
export const polkadotBeacon = beacon<KnownRpcMethods>("wss://rpc.polkadot.io");
export const statemintBeacon = beacon<KnownRpcMethods>("wss://statemint-rpc.polkadot.io");
export const subsocialBeacon = beacon<KnownRpcMethods>("wss://para.subsocial.network");
export const westendBeacon = beacon<KnownRpcMethods>("wss://westend-rpc.polkadot.io");
