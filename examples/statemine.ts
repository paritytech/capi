import { $, alice, bob, MetaRune, Rune, ValueRune } from "capi"
import { Uniques } from "zombienet/statemine.toml/collator/@latest/mod.ts"

const collection = 1
const item = 1

const createCollection = Uniques
  .create({
    collection,
    admin: alice.address,
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Create Collection:")
  .finalized()

const $collectionMetadata = $.object($.field("hello", $.str))

const setCollectionMetadata = Uniques
  .setCollectionMetadata({
    collection,
    isFrozen: true,
    data: $collectionMetadata.encode({ hello: "collection" }),
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Set Collection Metadata:")
  .finalized()

const mintAsset = Uniques
  .mint({
    collection,
    item,
    owner: alice.address,
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Mint Asset:")
  .finalized()

const setAssetMetadata = Uniques
  .setMetadata({
    collection,
    item,
    isFrozen: true,
    data: new Uint8Array(),
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Set Asset Metadata:")
  .finalized()

const setAssetPrice = Uniques
  .setPrice({
    collection,
    item,
    price: 1000000n,
    whitelistedBuyer: undefined,
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Set Asset Price:")
  .finalized()

// prevent new mints in collection
const setCollectionMaxSupply = Uniques
  .setCollectionMaxSupply({
    collection,
    maxSupply: 1,
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Set Collection Max Supply:")
  .finalized()

const alicePrepareCollection = Rune
  .chain(() => createCollection)
  .chain(() => setCollectionMetadata)
  .chain(() => mintAsset)
  .chain(() => setAssetMetadata)
  .chain(() => setAssetPrice)
  .chain(() => setCollectionMaxSupply)

const collectionId = Uniques.Class
  .entryPage(50)
  .into(ValueRune)
  .access(0, 0, 0)
  .unhandle(undefined)

const assetId = collectionId.map((collectionId) => Uniques.Asset.entryPage(50, [collectionId]))
  .into(MetaRune)
  .flat()
  .into(ValueRune)
  .access(0, 0, 1)
  .unhandle(undefined)

const price = Uniques.ItemPriceOf
  .entry(Rune.tuple([collectionId, assetId]))
  .unhandle(undefined)
  .access(0)

const bobBuyAsset = Uniques
  .buyItem({
    collection: collectionId,
    item: assetId,
    bidPrice: price,
  })
  .signed({ sender: bob })
  .sent()
  .dbgStatus("Buying Asset:")
  .finalized()

await Rune
  .chain(() => alicePrepareCollection)
  .chain(() => bobBuyAsset)
  .chain(() =>
    Uniques.Asset
      .entry(Rune.tuple([collectionId, assetId]))
      .unhandle(undefined)
      .access("owner")
      .dbg("New Owner:")
  )
  .run()
