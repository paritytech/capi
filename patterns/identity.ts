import { Data, IdentityInfo as IdentityInfoRaw } from "polkadot_dev/types/pallet_identity/types.ts"
import * as $ from "../deps/scale.ts"
import { Rune, RunicArgs } from "../rune/mod.ts"

export interface IdentityInfo<A extends Record<string, unknown>> {
  additional: A
  display: string
  legal?: string
  web?: string
  riot?: string
  email?: string
  pgpFingerprint?: string
  image?: string
  twitter?: string
}

export class IdentityInfoTranscoders<A extends Record<string, any>> {
  constructor(readonly additionalCodecs?: { [K in keyof A]: $.Codec<A[K]> }) {}

  encode<X>(props: RunicArgs<X, IdentityInfo<A>>) {
    const { additionalCodecs } = this
    const additional = additionalCodecs
      ? Rune
        .resolve(props.additional)
        .map((additional) =>
          Object
            .entries(additionalCodecs)
            .map(([k, $v]) => [encodeStr(k), encoder($v)(additional[k])] as [Data, Data])
        )
        .throws(IdentityDataTooLargeError)
      : []
    const pgpFingerprint = Rune
      .resolve(props.pgpFingerprint)
      .unhandle(undefined).map((v) => $.str.encode(v))
      .rehandle(undefined)
    const rest = Rune
      .rec(Object.fromEntries(REST_KEYS.map((key) => [
        key,
        Rune
          .resolve(props[key])
          .unhandle(undefined)
          .map(encodeStr)
          .rehandle(undefined, () => Data.None()),
      ])))
      .unsafeAs<Record<typeof REST_KEYS[number], Data>>()
    return Rune
      .tuple([additional, pgpFingerprint, rest])
      .map(([additional, pgpFingerprint, rest]) => ({ additional, pgpFingerprint, ...rest }))
  }

  decode<X>(...[identityInfo]: RunicArgs<X, [IdentityInfoRaw]>) {
    const { additionalCodecs } = this
    return Rune
      .resolve(identityInfo)
      .map(({
        additional: additionalRaw,
        pgpFingerprint: pgpFingerprintRaw,
        ...restRaw
      }) => {
        const additional = additionalCodecs
          ? Object.fromEntries(additionalRaw.map(([kd, vd]) => {
            const k: keyof A = "value" in kd ? $.str.decode(kd.value) : (() => {
              throw new CouldNotDecodeIdentityInfoAdditionalKey()
            })()
            return [k, vd.type === "None" ? undefined : additionalCodecs![k]!.decode(vd.value)]
          }))
          : {}
        const pgpFingerprint = pgpFingerprintRaw ? $.str.decode(pgpFingerprintRaw) : undefined
        const rest = Object.fromEntries(
          Object
            .entries(restRaw)
            .map(([key, data]) => [
              key,
              data.type === "None" ? undefined : $.str.decode(data.value),
            ]),
        )
        return { pgpFingerprint, additional, ...rest }
      })
      .throws(CouldNotDecodeIdentityInfoAdditionalKey)
  }
}

const encodeStr = encoder($.str)
function encoder<T>(codec: $.Codec<T>) {
  return (value: T) => {
    const encoded = codec.encode(value)
    const { length } = encoded
    if (length > 32) throw new IdentityDataTooLargeError()
    return { type: `Raw${length}`, value: encoded } as Data
  }
}

const REST_KEYS = ["display", "legal", "web", "riot", "email", "image", "twitter"] as const

export class IdentityDataTooLargeError extends Error {
  override readonly name = "IdentityDataTooLargeError"
}
export class CouldNotDecodeIdentityInfoAdditionalKey extends Error {
  override readonly name = "CouldNotDecodeIdentityInfoAdditionalKey"
}
