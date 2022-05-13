import { HOEffect, MaybeEffectLike } from "/effect/Base.ts";
import { native } from "/effect/intrinsic/Native.ts";
import * as crypto from "/target/wasm/crypto/mod.js";
import * as hex from "std/encoding/hex.ts";

export type AnySs58Address = Ss58AddressFromText;

// TODO: fine-tune
export class Ss58AddressFromText<Init extends MaybeEffectLike<string> = MaybeEffectLike<string>> extends HOEffect {
  root;

  constructor(readonly init: Init) {
    super();
    this.root = native([init], (init) => {
      return async () => {
        return [...hex.decode(crypto.decodeSs58(init))];
      };
    });
  }
}

export const ss58AddressFromText = <Init extends MaybeEffectLike<string>>(init: Init): Ss58AddressFromText<Init> => {
  return new Ss58AddressFromText(init);
};
