// TODO: swap out `KnownRpcMethods` with narrowed lookups
// @see https://github.com/paritytech/capi/issues/127

import { config, Meta } from "../config/mod.ts";
import { KnownRpcMethods } from "./methods.ts";

// TODO
type KnownFrameLookup = Meta<{
  pallets: {
    balances: {
      entries: {
        Something: {
          keys: [];
          value: "SUP";
        };
        Account: {
          keys: [accountId: Uint8Array];
          value: "TODO";
        };
      };
    };
  };
}>;

// TODO: swap out chain-specifics

const Config_ = config<KnownRpcMethods, KnownFrameLookup>();

export class Polkadot extends Config_("wss://rpc.polkadot.io") {}
export const polkadot = new Polkadot();

export class Kusama extends Config_("wss://kusama-rpc.polkadot.io") {}
export const kusama = new Kusama();

export class Acala extends Config_("wss://acala-polkadot.api.onfinality.io/public-ws") {}
export const acala = new Acala();

export class Moonbeam extends Config_("wss://wss.api.moonbeam.network") {}
export const moonbeam = new Moonbeam();

export class Statemint extends Config_("wss://statemint-rpc.polkadot.io") {}
export const statemint = new Statemint();

export class Subsocial extends Config_("wss://para.subsocial.network") {}
export const subsocial = new Subsocial();

export class Westend extends Config_("wss://westend-rpc.polkadot.io") {}
export const westend = new Westend();
