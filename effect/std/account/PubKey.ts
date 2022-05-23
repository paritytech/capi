import { HOEffect } from "/effect/Effect.ts";
import { step } from "/effect/intrinsic/Step.ts";
import { Ss58 } from "/effect/std/account/Ss58.ts";
import { DecodeSs58R } from "/env/mod.ts";
import * as hex from "std/encoding/hex.ts";

export abstract class PubKey<Init = any> extends HOEffect {
  constructor(readonly init: Init) {
    super();
  }
}

export class PubKeyFromSs58<Init extends Ss58> extends PubKey<Init> {
  root;

  constructor(init: Init) {
    super(init);
    this.root = step("PubKeyFromSs58", [init], (init) => {
      return async (env: DecodeSs58R) => {
        // TODO: decode byte representation instead
        return hex.decode(env.decodeSs58Text(init));
      };
    });
  }
}

export const pubKeyFromSs58 = <Init extends Ss58>(init: Init): PubKeyFromSs58<Init> => {
  return new PubKeyFromSs58(init);
};
