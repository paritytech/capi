import { EnsureLookup } from "../util/types.ts";
import { LOOKUP } from "./generated.ts";

export type EnsureKnownLookup<
  T,
  L extends { [N in keyof LOOKUP]: T },
> = EnsureLookup<keyof LOOKUP, T, L>;

export const ACALA_PROXY_WS_URL = "wss://acala-polkadot.api.onfinality.io/public-ws";
export const acalaBeacon = [ACALA_PROXY_WS_URL] as const;

export const KUSAMA_PROXY_WS_URL = "wss://kusama-rpc.polkadot.io";
export const kusamaBeacon = [KUSAMA_PROXY_WS_URL] as const;

export const MOONBEAM_PROXY_WS_URL = "wss://wss.api.moonbeam.network";
export const moonbeamBeacon = [MOONBEAM_PROXY_WS_URL] as const;

export const POLKADOT_PROXY_WS_URL = "wss://rpc.polkadot.io";
export const polkadotBeacon = [POLKADOT_PROXY_WS_URL] as const;

export const STATEMINT_PROXY_WS_URL = "wss://statemint-rpc.polkadot.io";
export const statemintBeacon = [STATEMINT_PROXY_WS_URL] as const;

export const SUBSOCIAL_PROXY_WS_URL = "wss://para.subsocial.network";
export const subsocialBeacon = [SUBSOCIAL_PROXY_WS_URL] as const;

export const WESTEND_PROXY_WS_URL = "wss://westend-rpc.polkadot.io";
export const westendBeacon = [WESTEND_PROXY_WS_URL] as const;
