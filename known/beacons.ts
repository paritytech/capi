// TODO: swap out `KnownRpcMethods` with narrowed lookups
// @see https://github.com/paritytech/capi/issues/127

import { beacon } from "../Beacon.ts";
import { chain } from "../core/mod.ts";
import { KnownRpcMethods } from "./methods.ts";

export const polkadotBeacon = beacon<KnownRpcMethods>(
  "wss://rpc.polkadot.io",
);
export const polkadot = chain(polkadotBeacon);

export const kusamaBeacon = beacon<KnownRpcMethods>(
  "wss://kusama-rpc.polkadot.io",
);
export const kusama = chain(kusamaBeacon);

export const acalaBeacon = beacon<KnownRpcMethods>(
  "wss://acala-polkadot.api.onfinality.io/public-ws",
);
export const acala = chain(acalaBeacon);

export const moonbeamBeacon = beacon<KnownRpcMethods>(
  "wss://wss.api.moonbeam.network",
);
export const moonbeam = chain(moonbeamBeacon);

export const statemintBeacon = beacon<KnownRpcMethods>(
  "wss://statemint-rpc.polkadot.io",
);
export const statemint = chain(statemintBeacon);

export const subsocialBeacon = beacon<KnownRpcMethods>(
  "wss://para.subsocial.network",
);
export const subsocial = chain(subsocialBeacon);

export const westendBeacon = beacon<KnownRpcMethods>(
  "wss://westend-rpc.polkadot.io",
);
export const westend = chain(westendBeacon);
