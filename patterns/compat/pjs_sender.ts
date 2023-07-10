import { hex, ss58 } from "../../crypto/mod.ts"
import * as $ from "../../deps/scale.ts"
import { AddressPrefixChain, Chain, ChainRune, ExtrinsicSender } from "../../fluent/mod.ts"
import { SignerError } from "../../frame_metadata/mod.ts"
import { Rune, RunicArgs } from "../../rune/mod.ts"

export type PjsSigner = { signPayload?(payload: any): Promise<{ signature: string }> }

export function pjsSender<C extends AddressPrefixChain, CU>(
  chain: ChainRune<C, CU>,
  pjsSigner: PjsSigner,
) {
  const $pjsExtrinsic = chain.metadata.map((metadata) => {
    const $call = metadata.extrinsic.call
    const $extra = metadata.extrinsic.extra
    const $additional = metadata.extrinsic.additional

    const signedExtensions = mergeSortedArrays(
      keys.visit($extra),
      keys.visit($additional),
    )

    const $pjsExtrinsic = $.object<$.AnyCodec[]>(
      $.field("signedExtensions", $.constant(signedExtensions)),
      $.field("version", $.constant(4)), // protocolVersion
      $.field("method", $pjs($call)),
      convertExtensionCodec(pjsExtraKeyMap).visit($extra),
      convertExtensionCodec(pjsAdditionalKeyMap).visit($additional),
    )

    return $pjsExtrinsic
  })

  return <X>(...[address]: RunicArgs<X, [address: string]>) => {
    return Rune.tuple([chain.metadata, $pjsExtrinsic, address]).map(
      ([metadata, $pjsExtrinsic, address]): ExtrinsicSender<C> => {
        const $sig = metadata.extrinsic.signature as $.Codec<Chain.Signature<C>>
        const [, pubKey] = ss58.decode(address)
        return {
          address: { type: "Id" as const, value: pubKey } as any,
          sign: async (_: Uint8Array, fullData: Uint8Array) => {
            const payload: any = $pjsExtrinsic.decode(fullData)
            payload.address = address
            let sig
            try {
              sig = await pjsSigner.signPayload!(payload)
            } catch (e) {
              throw new SignerError(e)
            }
            return $sig.decode(hex.decode(sig.signature))
          },
        }
      },
    )
  }
}

type KeyHandler = (codec: $.Codec<any>) => $.Codec<any>

const simpleKeyHandler = (pjsKey: string): KeyHandler => (value) => $.field(pjsKey, $pjs(value))

const convertExtensionCodec = (keyMap: Record<string, KeyHandler>) => {
  const visitor: $.CodecVisitor<$.Codec<any>> = new $.CodecVisitor<$.Codec<any>>()
    .add($.field, (_, key: string, value) => {
      const handler = keyMap[key]
      if (handler === undefined) {
        throw new Error(`pjs signer: unknown extension ${key}`)
      }
      return handler(value)
    })
    .add($.object, (_, ...fields) => $.object(...fields.map((x) => visitor.visit(x))))
  return visitor
}

const keys: $.CodecVisitor<string[]> = new $.CodecVisitor<string[]>()
  .add($.field, (_, key: string, _v) => [key])
  .add($.object, (_, ...fields) => fields.flatMap((x) => keys.visit(x)))

// https://github.com/polkadot-js/api/tree/8282159/packages/types/src/extrinsic/signedExtensions

const pjsExtraKeyMap: Record<string, KeyHandler> = {
  CheckEra: simpleKeyHandler("era"),
  CheckMortality: simpleKeyHandler("era"),
  ChargeTransactionPayment: simpleKeyHandler("tip"),
  CheckNonce: simpleKeyHandler("nonce"),
  ChargeAssetTxPayment: (value) => {
    // https://github.com/polkadot-js/api/blob/8282159/packages/types/src/extrinsic/signedExtensions/statemint.ts
    // pjs essentially spreads this into the extrinsic
    const visitor: $.CodecVisitor<$.Codec<any>> = new $.CodecVisitor<$.Codec<any>>()
      .add($.field, (_, key, value) => $.field(key, $pjs(value)))
      .add($.optionalField, (_, key, value) => $.optionalField(key, $pjs(value)))
      .add($.object, (_, ...fields) => $.object(...fields.map((x) => visitor.visit(x))))
    return visitor.visit(value)
  },
}

const pjsAdditionalKeyMap: Record<string, KeyHandler> = {
  CheckEra: simpleKeyHandler("blockHash"),
  CheckMortality: simpleKeyHandler("blockHash"),
  CheckSpecVersion: simpleKeyHandler("specVersion"),
  CheckTxVersion: simpleKeyHandler("transactionVersion"),
  CheckVersion: simpleKeyHandler("specVersion"),
  CheckGenesis: simpleKeyHandler("genesisHash"),
}

function $pjs<I, O>($inner: $.Codec<I, O>): $.Codec<(I & number) | string, (O & number) | string> {
  return $.createCodec({
    _metadata: $.metadata("$pjs", $pjs, $inner),
    _staticSize: $inner._staticSize,
    _encode(buffer, value) {
      if (typeof value === "number") $inner.encode(value)
      else buffer.insertArray(hex.decode(value))
    },
    _decode(buffer) {
      const start = buffer.index
      const value = $inner._decode(buffer)
      if (typeof value === "number") return value
      return hex.encodePrefixed(buffer.array.subarray(start, buffer.index))
    },
    _assert() {},
  })
}

function mergeSortedArrays<T>(a: T[], b: T[]) {
  let i = 0
  main:
  for (const value of a) {
    for (let j = i; j < b.length; j++) {
      if (b[j] === value) {
        i = j + 1
        continue main
      }
    }
    b.splice(i++, 0, value)
  }
  return b
}
