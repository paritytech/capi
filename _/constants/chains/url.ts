export const POLKADOT_RPC_URL = "wss://rpc.polkadot.io" as const;
export const KUSAMA_RPC_URL = "wss://kusama-rpc.polkadot.io" as const;
export const STATEMINT_RPC_URL = "wss://statemint-rpc.polkadot.io" as const;
export const MOONBEAM_RPC_URL = "wss://wss.api.moonbeam.network" as const;
export const ACALA_RPC_URL = "wss://acala-polkadot.api.onfinality.io/public-ws" as const;
export const SUBSOCIAL_RPC_URL = "wss://para.subsocial.network" as const;

export const CHAIN_URL_LOOKUP = [
  ["polkadot", POLKADOT_RPC_URL],
  ["kusama", KUSAMA_RPC_URL],
  ["statemint", STATEMINT_RPC_URL],
  ["moonbeam", MOONBEAM_RPC_URL],
  ["acala", ACALA_RPC_URL],
  ["subsocial", SUBSOCIAL_RPC_URL],
] as const;
