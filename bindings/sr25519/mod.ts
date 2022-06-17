// TODO: brands
import { instantiate } from "./mod.generated.js";

export interface Pair {
  pubKey: Uint8Array;
  secretKey: Uint8Array;
  sign(message: Uint8Array): Uint8Array;
}
export type PairCtor =
  & (new(
    pubKeyBytes: Uint8Array,
    secretKeyBytes: Uint8Array,
  ) => Pair)
  & { fromSecretSeed(byte: Uint8Array): Pair };

export interface Sr25519 {
  Pair: PairCtor;
  verify(
    signature: Uint8Array,
    message: Uint8Array,
    pubKey: Uint8Array,
  ): boolean;
}

export async function Sr25519(): Promise<Sr25519> {
  const instance = await instantiate();
  return {
    Pair: instance.Pair,
    verify: instance.verify,
  };
}
