import { $, alice, bob, Rune, ValueRune } from "capi"
import { Nfts } from "zombienet/nfts.toml/collator/@latest/mod.js"
import { Event } from "zombienet/nfts.toml/collator/@latest/types/pallet_nfts/pallet.js"
import { MintType } from "zombienet/nfts.toml/collator/@latest/types/pallet_nfts/types.js"
import { RuntimeEvent } from "zombienet/nfts.toml/collator/@latest/types/westmint_runtime.js"
import { signature } from "../patterns/nfts/mod.ts"

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

const mintRandomizedNft = <U>(id: number, collection: Rune<number, U>) =>
  Nfts
    .mint({
      collection,
      item: id,
      mintTo: alice.address,
    })
    .signed(signature({ sender: alice }))
    .sent()
    .dbgStatus("Mint Item:")
    .finalized()

// await Utility.batch({
//   calls: Rune.tuple([
//     mintRandomizedNft(0, collection),
//     mintRandomizedNft(1, collection),
//     mintRandomizedNft(2, collection),
//   ]),
// })
// await mintRandomizedNft(1, collection).run()
// await mintRandomizedNft(2, collection).run()

// await Nfts.Item // .entryPageRaw(50)
//   .entryPage(50, Rune.tuple([collection]))
//   .into(ValueRune)
//   .dbg("Nfts:")
//   .run()

// await Nfts.Collection // .entryPageRaw(50)
//   .entryPage(50, null)
//   .into(ValueRune)
//   .dbg("Collections:")
//   .run()

const $collectionMetadata = $.object($.field("hello", $.str))

const setCollectionMetadata = collection.chain(() =>
  Nfts
    .setCollectionMetadata({
      collection,
      data: $collectionMetadata.encode({ hello: "collection" }),
    })
    .signed(signature({ sender: alice }))
    .sent()
    .dbgStatus("Set Collection Metadata:")
    .finalized()
)

const item = 0
const mintItem = setCollectionMetadata.chain(() =>
  Nfts
    .mint({
      collection,
      item,
      mintTo: alice.address,
    })
    .signed(signature({ sender: alice }))
    .sent()
    .dbgStatus("Mint Item:")
    .finalized()
)

const setItemMetadata = mintItem.chain(() =>
  Nfts
    .setMetadata({
      collection,
      item,
      data: new Uint8Array(), // TODO: ipfs file url
    })
    .signed(signature({ sender: alice }))
    .sent()
    .dbgStatus("Set Item Metadata:")
    .finalized()
)

const setItemPrice = setItemMetadata.chain(() =>
  Nfts
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
)

const lockItemProperties = setItemPrice.chain(() =>
  Nfts.lockItemProperties({
    collection,
    item,
    lockMetadata: true,
    lockAttributes: true,
  })
    .signed(signature({ sender: alice }))
    .sent()
    .dbgStatus("Lock Item Properties:")
    .finalized()
)

// prevent new mints in collection
const setCollectionMaxSupply = lockItemProperties.chain(() =>
  Nfts
    .setCollectionMaxSupply({
      collection,
      maxSupply: 1,
    })
    .signed(signature({ sender: alice }))
    .sent()
    .dbgStatus("Set Collection Max Supply:")
    .finalized()
)

const lockCollection = setCollectionMaxSupply.chain(() =>
  Nfts.lockCollection({
    collection,
    // forbid future updates of max supply
    lockSettings: 8n, // 8n TODO
  })
    .signed(signature({ sender: alice }))
    .sent()
    .dbgStatus("Lock Collection:")
    .finalized()
)

// const collectionId = Nfts.Collection // .entryPageRaw(50)
//   .value(collection)
//   .into(ValueRune)
//   .dbg("Collections:")
//   .access(0, 0)

// const itemId = Nfts.Item // .entryPageRaw(50, [collection])
//   .entryPage(50, Rune.tuple([collectionId]))
//   .into(ValueRune)
//   .dbg("Items:")
//   .access(0, 0, 1)

const price = Nfts.ItemPriceOf
  .value(Rune.tuple([collection, item]))
  .unhandle(undefined)
  .access(0)
  .dbg("Price:")

const bobBuyItem = Nfts
  .buyItem({
    collection: collection,
    item: item,
    bidPrice: price,
  })
  .signed(signature({ sender: bob }))
  .sent()
  .dbgStatus("Buying Item:")
  .finalized()

await Rune
  .chain(() => lockCollection)
  .chain(() => bobBuyItem)
  .chain(() =>
    Nfts.Item
      .value(Rune.tuple([collection, item]))
      .unhandle(undefined)
      .access("owner")
      .dbg("New Owner:")
  )
  .run()
