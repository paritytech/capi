import { $, alice, bob, MetaRune, Rune, ValueRune } from "capi"
import { Nfts } from "zombienet/nfts.toml/collator/@latest/mod.ts"
import { MintType } from "zombienet/nfts.toml/collator/@latest/types/pallet_nfts/types"

const collection = 1
const item = 1

const DefaultCollectionSetting = {
  TransferableItems: 1n << 0n,
  UnlockedMetadata: 1n << 1n,
  UnlockedAttributes: 1n << 2n,
  UnlockedMaxSupply: 1n << 3n,
  DepositRequired: 1n << 4n,
}

const DefaultItemSetting = {
  Transferable: 1n << 0n,
  UnlockedMetadata: 1n << 1n,
  UnlockedAttributes: 1n << 2n,
}

const sum = (r: Record<string, bigint>) => Object.values(r).reduce((acc, curr) => curr + acc)

const createCollection = Nfts
  .create({
    config: {
      settings: sum(DefaultCollectionSetting),
      maxSupply: undefined,
      mintSettings: {
        mintType: MintType.Issuer,
        price: undefined,
        startBlock: undefined,
        endBlock: undefined,
        defaultItemSettings: sum(DefaultItemSetting),
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

const lockCollection = Nfts.lockCollection({
  collection,
  // forbid future updates of max supply
  lockSettings: sum(DefaultCollectionSetting) & ~DefaultCollectionSetting.UnlockedMaxSupply,
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
