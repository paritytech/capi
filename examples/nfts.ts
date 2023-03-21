import {
  $,
  alice,
  bob,
  ChainRune,
  Era,
  hex,
  Rune,
  RunicArgs,
  SignatureData,
  ss58,
  ValueRune,
} from "capi"
import { SignatureProps } from "capi/patterns/signature/polkadot.ts"
import { Nfts, WestmintLocal } from "zombienet/nfts.toml/collator/@latest/mod.js"
import { Event } from "zombienet/nfts.toml/collator/@latest/types/pallet_nfts/pallet.js"
import { MintType } from "zombienet/nfts.toml/collator/@latest/types/pallet_nfts/types.js"
import { RuntimeEvent } from "zombienet/nfts.toml/collator/@latest/types/westmint_runtime.js"

type NftSigProps = SignatureProps<WestmintLocal> & {
  assetId?: number
}

export function signature<X>(_props: RunicArgs<X, NftSigProps>) {
  return <CU>(chain: ChainRune<WestmintLocal, CU>) => {
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
      .throws(ss58.InvalidPublicKeyLengthError, ss58.InvalidNetworkPrefixError)
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
          assetId: props.assetId,
          tip: tip,
        }),
      }),
      additional: Rune.rec({
        CheckSpecVersion: specVersion,
        CheckTxVersion: transactionVersion,
        CheckGenesis: genesisHash,
        CheckMortality: checkpointHash,
      }),
    }) satisfies Rune<SignatureData<WestmintLocal>, unknown>
  }
}

// values are inverted for storage optimisation
const DefaultCollectionSetting = {
  TransferableItems: 0n << 0n,
  UnlockedMetadata: 0n << 1n,
  UnlockedAttributes: 0n << 2n,
  UnlockedMaxSupply: 0n << 3n,
  DepositRequired: 0n << 4n,
}

const DefaultItemSetting = {
  Transferable: 0n << 0n,
  UnlockedMetadata: 0n << 1n,
  UnlockedAttributes: 0n << 2n,
}

const sum = (r: Record<string, bigint>) => Object.values(r).reduce((acc, curr) => curr + acc)

const createCollection = Nfts
  .create({
    config: Rune.rec({
      settings: sum(DefaultCollectionSetting),
      mintSettings: Rune.rec({
        mintType: MintType.Issuer(),
        defaultItemSettings: sum(DefaultItemSetting),
      }),
    }),
    admin: alice.address,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Create Collection:")
  .finalized()

const collection = createCollection
  .events()
  .into(ValueRune)
  .map((events) => {
    const event = events.find((event) =>
      RuntimeEvent.isNfts(event.event) && Event.isCreated(event.event.value)
    )?.event.value as Event.Created | undefined
    return event?.collection
  })
  .unhandle(undefined)
  .dbg("Collection Id:")

const $collectionMetadata = $.object($.field("hello", $.str))

const setCollectionMetadata = Nfts
  .setCollectionMetadata({
    collection,
    data: $collectionMetadata.encode({ hello: "collection" }),
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Set Collection Metadata:")
  .finalized()

const item = 0

const mintItem = Nfts
  .mint({
    collection,
    item,
    mintTo: alice.address,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Mint Item:")
  .finalized()

const setItemMetadata = Nfts
  .setMetadata({
    collection,
    item,
    data: new Uint8Array(), // TODO: ipfs file url
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Set Item Metadata:")
  .finalized()

const setItemPrice = Nfts
  .setPrice({
    collection,
    item,
    price: 1000000n,
    whitelistedBuyer: undefined,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Set Item Price:")
  .finalized()

const lockItemProperties = Nfts.lockItemProperties({
  collection,
  item,
  lockMetadata: true,
  lockAttributes: true,
})
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Lock Item Properties:")
  .finalized()

// prevent new mints in collection
const setCollectionMaxSupply = Nfts
  .setCollectionMaxSupply({
    collection,
    maxSupply: 1,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Set Collection Max Supply:")
  .finalized()

const lockCollection = Nfts.lockCollection({
  collection,
  // forbid future updates of max supply
  lockSettings: 8n, // 8n TODO
})
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Lock Collection:")
  .finalized()

const alicePrepareCollection = Rune
  .chain(() => createCollection)
  .chain(() => setCollectionMetadata)
  .chain(() => mintItem)
  .chain(() => setItemMetadata)
  .chain(() => setItemPrice)
  .chain(() => lockItemProperties)
  .chain(() => setCollectionMaxSupply)
  .chain(() => lockCollection)

const collectionId = Nfts.Collection // .entryPageRaw(50)
  .entryPage(50, null)
  .into(ValueRune)
  .dbg("Collections:")
  .access(0, 0)

const itemId = Nfts.Item // .entryPageRaw(50, [collection])
  .entryPage(50, Rune.tuple([collection]))
  .into(ValueRune)
  .dbg("Items:")
  .access(0, 0, 1)

const price = Nfts.ItemPriceOf
  .value(Rune.tuple([collection, item]))
  .unhandle(undefined)
  .access(0)
  .dbg("Price:")

const bobBuyItem = Nfts
  .buyItem({
    collection: collectionId,
    item: itemId,
    bidPrice: price,
  })
  .signed(signature({ sender: bob }))
  .sent()
  .dbgStatus("Buying Item:")
  .finalized()

await Rune
  .chain(() => alicePrepareCollection)
  .chain(() => bobBuyItem)
  .chain(() =>
    Nfts.Item
      .value(Rune.tuple([collectionId, itemId]))
      .unhandle(undefined)
      .access("owner")
      .dbg("New Owner:")
  )
  .run()
