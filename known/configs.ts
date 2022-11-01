// TODO: ultimately delete this file upon introduction of RPC-method-specific codegen

import { Config } from "../config/mod.ts";

export const polkadot = new Config(() => "wss://rpc.polkadot.io");
export const kusama = new Config(() => "wss://kusama-rpc.polkadot.io");
export const acala = new Config(() => "wss://acala-polkadot.api.onfinality.io/public-ws");
export const rococo = new Config(() => "wss://rococo-contracts-rpc.polkadot.io");
export const moonbeam = new Config(() => "wss://wss.api.moonbeam.network");
export const statemint = new Config(() => "wss://statemint-rpc.polkadot.io");
export const subsocial = new Config(() => "wss://para.subsocial.network");
export const westend = new Config(() => "wss://westend-rpc.polkadot.io");
