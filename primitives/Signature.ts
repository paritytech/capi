export type Signature = Sr25519Signature;

export const enum SignatureKind {
  Sr25519 = "Sr25519",
}

export abstract class SignatureBase {
  constructor(
    readonly _tag: SignatureKind,
    readonly value: Uint8Array,
  ) {
  }
}

export class Sr25519Signature extends SignatureBase {
  constructor(bytes: Uint8Array) {
    super(SignatureKind.Sr25519, bytes);
  }
}
