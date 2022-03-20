import * as sys from "/system/mod.ts";
import * as crypto from "/target/wasm/crypto/mod.js";
import * as hex from "std/encoding/hex.ts";

export const PubKeyBrand: unique symbol = Symbol();
export type PubKeyBrand = typeof PubKeyBrand;

export interface PubKeyResolved {
  [PubKeyBrand]: true;
  bytes: Uint8Array;
}

export namespace PubKey {
  export const Ss58Text = <Ss58Text extends sys.AnyEffectA<string>>(ss58Text: Ss58Text) => {
    return sys.effect<PubKeyResolved, {}>()("PubKeySs58Text", { ss58Text }, async (_, resolved) => {
      return sys.ok({
        [PubKeyBrand]: true as const,
        bytes: hex.decode(crypto.decodeSs58(resolved.ss58Text)),
      });
    });
  };
}
