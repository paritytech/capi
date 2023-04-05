import {
  Chain,
  ChainRune,
  Era,
  ExtrinsicSender,
  hex,
  Rune,
  RunicArgs,
  SignatureData,
  ss58,
  ValueRune,
} from "../../mod.ts"

export interface SignatureProps<T extends Chain> {
  sender: ExtrinsicSender<T>
  checkpoint?: string
  mortality?: Era
  nonce?: number
  tip?: bigint
}

export function signature<X, C extends Chain>(_props: RunicArgs<X, SignatureProps<C>>) {
  return <CU>(chain: ChainRune<C, CU>) => {
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
          case "Id":
            return ss58.encode(addrPrefix, sender.address.value)
          default:
            throw new Error("unimplemented")
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
    return Rune.rec({
      sender: props.sender,
      extra: Rune.rec({
        CheckMortality: mortality,
        CheckNonce: nonce,
        ChargeTransactionPayment: tip,
        ChargeAssetTxPayment: Rune.rec({
          // TODO:
          // assetId: props.assetId,
          tip: tip,
        }),
      }),
      additional: Rune.rec({
        CheckSpecVersion: specVersion,
        CheckTxVersion: transactionVersion,
        CheckGenesis: genesisHash,
        CheckMortality: checkpointHash,
      }),
      // @ts-ignore: .
    }) satisfies Rune<SignatureData<C>, unknown>
  }
}
