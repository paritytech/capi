// TODO: swap out `KnownRpcMethods` with narrowed lookups
// @see https://github.com/paritytech/capi/issues/127

import { chain } from "../core/mod.ts";
import { ProxyBeacon } from "../rpc/mod.ts";
import { KnownRpcMethods } from "./methods.ts";

const Beacon_ = ProxyBeacon<KnownRpcMethods>;

export const polkadotBeacon = new Beacon_("wss://rpc.polkadot.io");
export const polkadot = chain(polkadotBeacon);

export const kusamaBeacon = new Beacon_("wss://kusama-rpc.polkadot.io");
export const kusama = chain(kusamaBeacon);

export const acalaBeacon = new Beacon_("wss://acala-polkadot.api.onfinality.io/public-ws");
export const acala = chain(acalaBeacon);

export const moonbeamBeacon = new Beacon_("wss://wss.api.moonbeam.network");
export const moonbeam = chain(moonbeamBeacon);

export const statemintBeacon = new Beacon_("wss://statemint-rpc.polkadot.io");
export const statemint = chain(statemintBeacon);

export const subsocialBeacon = new Beacon_("wss://para.subsocial.network");
export const subsocial = chain(subsocialBeacon);

export const westendBeacon = new Beacon_("wss://westend-rpc.polkadot.io");
export const westend = chain(westendBeacon);
