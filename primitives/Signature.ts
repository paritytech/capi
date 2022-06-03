export type Signature = Sr25519Signature;

export const enum SignatureKind {
  Sr25519 = "Sr25519",
}

export abstract class SignatureBase {
  0;

  constructor(
    readonly _tag: SignatureKind,
    bytes: Uint8Array,
  ) {
    const asA = { 0: [...bytes] };
    this[0] = asA;
  }
}

export class Sr25519Signature extends SignatureBase {
  constructor(bytes: Uint8Array) {
    super(SignatureKind.Sr25519, bytes);
  }
}
