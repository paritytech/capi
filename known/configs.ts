// TODO: ultimately delete this file upon introduction of RPC-method-specific codegen

import { Config } from "../config/mod.ts";
import * as knownRpc from "./rpc.ts";

// @see https://github.com/paritytech/capi/issues/127
const Config_ = Config<
  string,
  knownRpc.CallMethods,
  knownRpc.SubscriptionMethods,
  knownRpc.ErrorDetails
>;

export const polkadot = new Config_(() => "wss://rpc.polkadot.io", 0);
export const kusama = new Config_(() => "wss://kusama-rpc.polkadot.io", 2);
export const acala = new Config_(() => "wss://acala-polkadot.api.onfinality.io/public-ws", 10);
export const rococo = new Config_(
  () => "wss://rococo-contracts-rpc.polkadot.io",
  undefined!, /* TODO */
);
export const moonbeam = new Config_(() => "wss://wss.api.moonbeam.network", 1284);
export const statemint = new Config_(
  () => "wss://statemint-rpc.polkadot.io",
  undefined!, /* TODO */
);
export const subsocial = new Config_(() => "wss://para.subsocial.network", 28);
export const westend = new Config_(() => "wss://westend-rpc.polkadot.io", 42);
