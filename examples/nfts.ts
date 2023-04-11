import {
  createUsers,
  MintType,
  Nfts,
  PalletNftsEvent,
  RuntimeEvent,
  Utility,
} from "@capi/westend-dev/westmint/mod.js"
import { $, Rune } from "capi"
import { DefaultCollectionSetting, DefaultItemSetting } from "capi/patterns/nfts.ts"
import { signature } from "capi/patterns/signature/westmint.ts"

const { alexa, billy } = await createUsers()

// Create a collection and grab its events
const createEvents = await Nfts
  .create({
    config: Rune.rec({
      settings: DefaultCollectionSetting.allOff,
      mintSettings: Rune.rec({
        mintType: MintType.Issuer(),
        defaultItemSettings: DefaultItemSetting.allOn,
      }),
    }),
    admin: alexa.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Create Collection:")
  .finalizedEvents()
  .run()

// Extract the collection's id from emitted events
const collection = (() => {
  for (const { event } of createEvents) {
    if (RuntimeEvent.isNfts(event) && PalletNftsEvent.isCreated(event.value)) {
      return event.value.collection
    }
  }
  return
})()

// Ensure the collection id is a number.
$.assert($.u32, collection)
console.log("Collection id:", collection)

// We'll create a single NFT with the id of 46
const item = 46

// Mint an item to the collection
await Nfts
  .mint({
    collection,
    item,
    mintTo: alexa.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Mint Item:")
  .finalized()
  .run()

await Utility
  .batchAll({
    calls: Rune.tuple([
      // 1. Set the NFT's price.
      Nfts.setPrice({
        collection,
        item,
        price: 1000000n,
        whitelistedBuyer: undefined,
      }),

      // 2. Limit NFTs for this collection to 1, preventing further minting.
      Nfts.setCollectionMaxSupply({ collection, maxSupply: 1 }),

      // 3. Lock collection to prevent changes to the NFT limit
      Nfts.lockCollection({ collection, lockSettings: 8n }), // TODO: enum helper
    ]),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Sale prep calls:")
  .finalized()
  .run()

// Get the price of the NFT
const price = await Nfts.ItemPriceOf
  .value(Rune.tuple([collection, item]))
  .unhandle(undefined)
  .access(0)
  .run()
console.log(price)

// Buy the NFT using Billy's address
await Nfts
  .buyItem({
    collection: collection,
    item: item,
    bidPrice: price,
  })
  .signed(signature({ sender: billy }))
  .sent()
  .dbgStatus("Buying Item:")
  .finalized()
  .run()

// Check for Billy's new ownership of the NFT
const owner = await Nfts.Item
  .value(Rune.tuple([collection, item]))
  .unhandle(undefined)
  .access("owner")
  .run()
console.log("Owner:", owner)
