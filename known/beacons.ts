// TODO: swap out `KnownRpcMethods` with narrowed lookups
// @see https://github.com/paritytech/capi/issues/127

import { beacon as beacon_ } from "../Beacon.ts";
import { chain } from "../core/mod.ts";
import { KnownRpcMethods } from "./methods.ts";

const beacon = beacon_<string, KnownRpcMethods>;

export const polkadotBeacon = beacon("wss://rpc.polkadot.io");
export const polkadot = chain(polkadotBeacon);

export const kusamaBeacon = beacon("wss://kusama-rpc.polkadot.io");
export const kusama = chain(kusamaBeacon);

export const acalaBeacon = beacon("wss://acala-polkadot.api.onfinality.io/public-ws");
export const acala = chain(acalaBeacon);

export const moonbeamBeacon = beacon("wss://wss.api.moonbeam.network");
export const moonbeam = chain(moonbeamBeacon);

export const statemintBeacon = beacon("wss://statemint-rpc.polkadot.io");
export const statemint = chain(statemintBeacon);

export const subsocialBeacon = beacon("wss://para.subsocial.network");
export const subsocial = chain(subsocialBeacon);

export const westendBeacon = beacon("wss://westend-rpc.polkadot.io");
export const westend = chain(westendBeacon);
