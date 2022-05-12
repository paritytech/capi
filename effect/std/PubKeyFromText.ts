import { HOEffect, MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import * as crypto from "/target/wasm/crypto/mod.js";
import * as hex from "std/encoding/hex.ts";

export class PubKeyFromSs58Text<Init extends MaybeEffectLike<string>> extends HOEffect {
  root;

  constructor(readonly init: Init) {
    super();
    this.root = native([init], (init) => {
      return async () => {
        return hex.decode(crypto.decodeSs58(init));
      };
    });
  }
}

export const pubKeyFromSs58Text = <Init extends MaybeEffectLike<string>>(init: Init): PubKeyFromSs58Text<Init> => {
  return new PubKeyFromSs58Text(init);
};
