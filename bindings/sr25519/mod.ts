// TODO: brands
// TODO: narrow error types
import { instantiate } from "./mod.generated.mjs";

export interface PublicKey {
  bytes: Uint8Array;
  signer(secretKey: Uint8Array): Signer;
  verify(
    signature: Uint8Array,
    message: Uint8Array,
  ): boolean;
}
export interface PublicKeyCtor {
  from(bytes: Uint8Array): PublicKey;
}

export type Sign = (message: Uint8Array) => Uint8Array;

export interface Signer {
  sign: Sign;
}

export interface TestUserCtor {
  fromName(name: "alice" | "bob" | "TODO"): TestUser;
}

export interface TestUser {
  sign: Sign;
  publicKey: Uint8Array;
}

export interface Sr25519 {
  PublicKey: PublicKeyCtor;
  TestUser: TestUserCtor;
}

export async function Sr25519(): Promise<Sr25519> {
  const instance = await instantiate();
  return {
    PublicKey: instance.PublicKey,
    TestUser: instance.TestUser,
  };
}
