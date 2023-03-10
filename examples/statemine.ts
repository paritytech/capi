import { $, alice, bob, MetaRune, Rune, ValueRune } from "capi"
import { MintType } from "http://localhost:4646/frame/zombienet/zombienets/nfts.toml/collator/@v0.9.370/types/pallet_nfts/types"
import { Nfts } from "zombienet/nfts.toml/collator/@latest/mod.ts"

const collection = 1
const item = 1

// const collectionSettings = convertToByte({  })

// after done minting all items, need to disable item metadata, and disable new minting (CollectionSetting.UnlockedMaxSupply), and lock collection metadata (CollectionSetting.UnlockedMetadata, .UnlockedAttributes)

const createCollection = Nfts
  .create({
    config: {
      settings: BigInt(1 & 1 & 1 & 1 & 1),
      maxSupply: undefined,
      mintSettings: {
        mintType: MintType.Issuer,
        price: undefined,
        startBlock: undefined,
        endBlock: undefined,
        defaultItemSettings: BigInt(1 & 1 & 1),
      },
    },
    admin: alice.address,
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Create Collection:")
  .finalized()

const $collectionMetadata = $.object($.field("hello", $.str))

const setCollectionMetadata = Nfts
  .setCollectionMetadata({
    collection,
    data: $collectionMetadata.encode({ hello: "collection" }),
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Set Collection Metadata:")
  .finalized()

const mintItem = Nfts
  .mint({
    collection,
    item,
    mintTo: alice.address,
    witnessData: undefined,
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Mint Item:")
  .finalized()

const setItemMetadata = Nfts
  .setMetadata({
    collection,
    item,
    data: new Uint8Array(), // TODO: ipfs file url
  })
  .signed({ sender: alice })
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
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Set Item Price:")
  .finalized()

// prevent new mints in collection
const setCollectionMaxSupply = Nfts
  .setCollectionMaxSupply({
    collection,
    maxSupply: 1,
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Set Collection Max Supply:")
  .finalized()

// const updateMintSettings = Nfts.updateMintSettings({
//   collection,
//   mintSettings: {
//     mintType: MintType.Issuer,
//     price: undefined,
//     startBlock: undefined,
//     endBlock: undefined,
//     defaultItemSettings: BigInt(1 & 0 & 0), // forbid further updates of metadata
//   }
// })

const lockItemProperties = Nfts.lockItemProperties({
  collection,
  item,
  lockMetadata: true,
  lockAttributes: true,
})
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Lock Item Properties:")
  .finalized()

const lockCollection = Nfts.lockCollection({
  collection,
  lockSettings: BigInt(1 | 0 | 0 | 0 | 1), // forbit future updates of max supply
})
  .signed({ sender: alice })
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

const collectionId = Nfts.Collection
  .entryPage(50)
  .into(ValueRune)
  .access(0, 0, 0)
  .unhandle(undefined)

const assetId = collectionId.map((collectionId) => Nfts.Item.entryPage(50, [collectionId]))
  .into(MetaRune)
  .flat()
  .into(ValueRune)
  .access(0, 0, 1)
  .unhandle(undefined)

const price = Nfts.ItemPriceOf
  .entry(Rune.tuple([collectionId, assetId]))
  .unhandle(undefined)
  .access(0)

const bobBuyItem = Nfts
  .buyItem({
    collection: collectionId,
    item: assetId,
    bidPrice: price,
  })
  .signed({ sender: bob })
  .sent()
  .dbgStatus("Buying Item:")
  .finalized()

await Rune
  .chain(() => alicePrepareCollection)
  .chain(() => bobBuyItem)
  .chain(() =>
    Nfts.Item
      .entry(Rune.tuple([collectionId, assetId]))
      .unhandle(undefined)
      .access("owner")
      .dbg("New Owner:")
  )
  .run()
