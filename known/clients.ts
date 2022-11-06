import { rpcClient } from "../effects/mod.ts";
import * as rpc from "../rpc/mod.ts";

export const polkadot = rpcClient(rpc.proxyProvider, "wss://rpc.polkadot.io");
export const kusama = rpcClient(rpc.proxyProvider, "wss://kusama-rpc.polkadot.io");
export const acala = rpcClient(
  rpc.proxyProvider,
  "wss://acala-polkadot.api.onfinality.io/public-ws",
);
export const rococo = rpcClient(rpc.proxyProvider, "wss://rococo-contracts-rpc.polkadot.io");
export const moonbeam = rpcClient(rpc.proxyProvider, "wss://wss.api.moonbeam.network");
export const statemint = rpcClient(rpc.proxyProvider, "wss://statemint-rpc.polkadot.io");
export const subsocial = rpcClient(rpc.proxyProvider, "wss://para.subsocial.network");
export const westend = rpcClient(rpc.proxyProvider, "wss://westend-rpc.polkadot.io");
