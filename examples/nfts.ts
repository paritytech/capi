import { $, alice, bob, Rune, ValueRune } from "capi"
import { Nfts } from "zombienet/nfts.toml/collator/@latest/mod.ts"
import { Event } from "zombienet/nfts.toml/collator/@latest/types/pallet_nfts/pallet.ts"
import { MintType } from "zombienet/nfts.toml/collator/@latest/types/pallet_nfts/types.ts"
import { RuntimeEvent } from "zombienet/nfts.toml/collator/@latest/types/westmint_runtime.ts"

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
      maxSupply: undefined,
      mintSettings: Rune.rec({
        mintType: MintType.Issuer(),
        price: undefined,
        startBlock: undefined,
        endBlock: undefined,
        defaultItemSettings: sum(DefaultItemSetting),
      }),
    }),
    admin: alice.address,
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Create Collection:")
  .finalized()

const collection = createCollection
  .events()
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
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Set Collection Metadata:")
  .finalized()

const item = 1

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
  lockSettings: 8n, // 8n TODO
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

const collectionId = Nfts.Collection // .entryPageRaw(50)
  .entryPage(50)
  .into(ValueRune)
  .access(0, 0, 0)
  .unhandle(undefined)
  .dbg("Collections:")

const itemId = Nfts.Item // .entryPageRaw(50, [collection])
  .entryPage(50, Rune.tuple([collection]))
  .into(ValueRune)
  .access(0, 0, 1)
  .unhandle(undefined)
  .dbg("Items:")

const price = Nfts.ItemPriceOf
  .entry(Rune.tuple([collection, item]))
  .unhandle(undefined)
  .access(0)
  .dbg("Price:")

const bobBuyItem = Nfts
  .buyItem({
    collection: collectionId,
    item: itemId,
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
      .entry(Rune.tuple([collectionId, itemId]))
      .unhandle(undefined)
      .access("owner")
      .dbg("New Owner:")
  )
  .run()
