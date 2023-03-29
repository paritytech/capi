import {
  sr25519_from_seed,
  sr25519_pubkey,
  sr25519_sign,
  sr25519_verify,
} from "../deps/capi_crypto_wrappers.ts"

export class Sr25519 {
  address

  constructor(readonly publicKey: Uint8Array, readonly secretKey: Uint8Array) {
    if (publicKey.length !== 32) throw new Error("Invalid publicKey")
    if (secretKey.length !== 64) throw new Error("Invalid secretKey")
    this.address = { type: "Id" as const, value: this.publicKey }
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

  static verify(pubkey: Uint8Array, msg: Uint8Array, sig: Uint8Array) {
    return sr25519_verify(pubkey, msg, sig)
  }
}
