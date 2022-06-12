export type Signature = Sr25519Signature;

export type SignatureKind = "Sr25519";

export abstract class SignatureBase {
  constructor(
    readonly type: SignatureKind,
    readonly value: Uint8Array,
  ) {
  }
}

export class Sr25519Signature extends SignatureBase {
  constructor(bytes: Uint8Array) {
    super("Sr25519", bytes);
  }
}
