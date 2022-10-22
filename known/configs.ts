// TODO: ultimately delete this file upon introduction of RPC-method-specific codegen

import { Config } from "../config/mod.ts";

export const polkadot = new Config(() => "wss://rpc.polkadot.io", 0);
export const kusama = new Config(() => "wss://kusama-rpc.polkadot.io", 2);
export const acala = new Config(() => "wss://acala-polkadot.api.onfinality.io/public-ws", 10);
export const rococo = new Config(
  () => "wss://rococo-contracts-rpc.polkadot.io",
  undefined!, /* TODO */
);
export const moonbeam = new Config(() => "wss://wss.api.moonbeam.network", 1284);
export const statemint = new Config(
  () => "wss://statemint-rpc.polkadot.io",
  undefined!, /* TODO */
);
export const subsocial = new Config(() => "wss://para.subsocial.network", 28);
export const westend = new Config(() => "wss://westend-rpc.polkadot.io", 42);
