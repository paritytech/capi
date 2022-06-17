// TODO: brands
// TODO: narrow error types
import { instantiate } from "./mod.generated.js";

export interface PublicKey {
  bytes: Uint8Array;
  signer(secretKey: Uint8Array): Signer;
  verify(
    signature: Uint8Array,
    message: Uint8Array,
  ): boolean;
}
export type PublicKeyCtor =
  & { from(bytes: Uint8Array): PublicKey }
  & (new() => PublicKey);

export interface Signer {
  sign(message: Uint8Array): Uint8Array;
}
export type SignerCtor = new() => Signer;

export interface Keypair {
  publicKey: string;
  secretKey: string;
}
export type KeypairCtor =
  & (new() => Keypair)
  & { fromSecretSeed(bytes: Uint8Array): Keypair };

export interface Sr25519 {
  PublicKey: PublicKeyCtor;
  Keypair: KeypairCtor;
}

export async function Sr25519(): Promise<Sr25519> {
  const instance = await instantiate();
  return {
    PublicKey: instance.PublicKey,
    Keypair: instance.Keypair,
  };
}
