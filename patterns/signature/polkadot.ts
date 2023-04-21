import { PolkadotChain } from "@capi/polkadot"
import { AddressPrefixChain, Chain, ChainRune } from "../../fluent/ChainRune.ts"
import { ExtrinsicSender, SignatureData } from "../../fluent/ExtrinsicRune.ts"
import { $, hex, ss58, ValueRune } from "../../mod.ts"
import { Rune, RunicArgs } from "../../rune/mod.ts"
import { Era } from "../../scale_info/overrides/Era.ts"

export interface SignatureProps<T extends Chain> {
  sender: ExtrinsicSender<T>
  checkpoint?: string
  mortality?: Era
  nonce?: number
  tip?: bigint
}

export interface PolkadotSignatureChain extends AddressPrefixChain {
  metadata: AddressPrefixChain["metadata"] & {
    pallets: {
      System: {
        constants: {
          Version: {
            codec: $.Codec<Chain.Constant.Value<PolkadotChain, "System", "Version">>
          }
        }
      }
    }
    extrinsic: Omit<PolkadotChain["metadata"]["extrinsic"], "call">
  }
}

export function signature<X>(_props: RunicArgs<X, SignatureProps<PolkadotSignatureChain>>) {
  return <CU>(chain: ChainRune<PolkadotSignatureChain, CU>) => {
    const props = RunicArgs.resolve(_props)
    const addrPrefix = chain.addressPrefix()
    const versions = chain.pallet("System").constant("Version").decoded
    const specVersion = versions.access("specVersion")
    const transactionVersion = versions.access("transactionVersion")
    // TODO: create union rune (with `matchTag` method) and utilize here
    // TODO: MultiAddress conversion utils
    const senderSs58 = Rune
      .tuple([addrPrefix, props.sender])
      .map(([addrPrefix, sender]) => {
        switch (sender.address.type) {
          case "Id": {
            return ss58.encode(addrPrefix, sender.address.value)
          }
          default: {
            throw new Error("unimplemented")
          }
        }
      })
      .throws(ss58.InvalidPayloadLengthError)
    const nonce = Rune.resolve(props.nonce)
      .unhandle(undefined)
      .rehandle(undefined, () => chain.connection.call("system_accountNextIndex", senderSs58))
    const genesisHashHex = chain.connection.call("chain_getBlockHash", 0).unsafeAs<string>()
      .into(ValueRune)
    const genesisHash = genesisHashHex.map(hex.decode)
    const checkpointHash = Rune.tuple([props.checkpoint, genesisHashHex]).map(([a, b]) => a ?? b)
      .map(hex.decode)
    const mortality = Rune.resolve(props.mortality).map((x) => x ?? Era.Immortal)
    const tip = Rune.resolve(props.tip).map((x) => x ?? 0n)
    return Rune.object({
      sender: props.sender,
      extra: Rune.object({
        CheckMortality: mortality,
        CheckNonce: nonce,
        ChargeTransactionPayment: tip,
      }),
      additional: Rune.object({
        CheckSpecVersion: specVersion,
        CheckTxVersion: transactionVersion,
        CheckGenesis: genesisHash,
        CheckMortality: checkpointHash,
      }),
    }) satisfies Rune<SignatureData<PolkadotSignatureChain>, unknown>
  }
}
