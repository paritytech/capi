import {
  sr25519_from_seed,
  sr25519_pubkey,
  sr25519_sign,
  sr25519_verify,
} from "../deps/capi_crypto_wrappers.ts"
import * as ed from "../deps/ed25519.ts"

export abstract class Keypair {
  address

  protected constructor(
    readonly publicKey: Uint8Array,
    readonly secretKey: Uint8Array,
  ) {
    this.address = { type: "Id" as const, value: this.publicKey }
  }

  abstract sign(msg: Uint8Array): { type: string; value: Uint8Array }
}

export class Ed25519 extends Keypair {
  protected constructor(
    publicKey: Uint8Array,
    secretKey: Uint8Array,
  ) {
    super(publicKey, secretKey)
  }

  static fromSecret(secret: Uint8Array) {
    const privateKey = secret.slice(0, 32)
    const publicKey = ed.sync.getPublicKey(privateKey)

    return new Ed25519(publicKey, privateKey)
  }

  sign = (msg: Uint8Array) => {
    return ({
      type: "Ed25519" as const,
      value: ed.sync.sign(msg, this.secretKey),
    })
  }

  static verify(pubkey: Uint8Array, msg: Uint8Array, sig: Uint8Array) {
    return ed.sync.verify(pubkey, msg, sig)
  }
}

export class Sr25519 extends Keypair {
  protected constructor(publicKey: Uint8Array, secretKey: Uint8Array) {
    if (publicKey.length !== 32) throw new Error("Invalid publicKey")
    if (secretKey.length !== 64) throw new Error("Invalid secretKey")
    super(publicKey, secretKey)
  }

  static fromSecret(secret: Uint8Array) {
    return new Sr25519(sr25519_pubkey(secret), secret)
  }

  static fromSeed(seed: Uint8Array) {
    const pair = sr25519_from_seed(seed)
    return new Sr25519(pair.slice(64), pair.slice(0, 64))
  }

  sign = (msg: Uint8Array) => ({
    type: "Sr25519" as const,
    value: sr25519_sign(this.publicKey, this.secretKey, msg),
  })

  toEd25519 = (): Ed25519 => Ed25519.fromSecret(this.secretKey)

  static verify(pubkey: Uint8Array, msg: Uint8Array, sig: Uint8Array) {
    return sr25519_verify(pubkey, msg, sig)
  }
}
