import { Nfts, Utility } from "@capi/rococo-dev/westmint/mod.js"
import { Event } from "@capi/rococo-dev/westmint/types/pallet_nfts/pallet.js"
import { MintType } from "@capi/rococo-dev/westmint/types/pallet_nfts/types.js"
import { RuntimeEvent } from "@capi/rococo-dev/westmint/types/westmint_runtime.js"
import { $, alice, bob, Rune } from "capi"
import { DefaultCollectionSetting, DefaultItemSetting } from "capi/patterns/nfts.ts"
import { signature } from "capi/patterns/signature/westmint.ts"

// Create a collection and grab its events
const createCollectionEvents = await Nfts
  .create({
    config: Rune.rec({
      settings: DefaultCollectionSetting.allOff,
      mintSettings: Rune.rec({
        mintType: MintType.Issuer(),
        defaultItemSettings: DefaultItemSetting.allOn,
      }),
    }),
    admin: alice.address,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Create Collection:")
  .finalizedEvents()
  .run()

// Extract the collection's id from emitted events
const collection =
  (createCollectionEvents.find((event) =>
    RuntimeEvent.isNfts(event.event) && Event.isCreated(event.event.value)
  )?.event.value as Event.Created).collection

console.log("Collection Id:", collection)

const item = 0

// Mint an item to the collection
await Nfts
  .mint({
    collection,
    item,
    mintTo: alice.address,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Mint Item:")
  .finalized()
  .run()

/// The following extrinsics will first be created, then batched to be sent together:

// Set the collection's metadata
const setCollectionMetadata = Nfts.setCollectionMetadata({
  collection,
  data: new Uint8Array(),
})

// Create and encode metadata for the NFT
const itemMetadata = $.object($.field("name", $.str)).encode({ name: "NFT #01" })

// Set the NFT's metadata
const setItemMetadata = Nfts.setMetadata({
  collection,
  item,
  data: itemMetadata,
})

// Set the NFT's price
const setItemPrice = Nfts.setPrice({
  collection,
  item,
  price: 1000000n,
  whitelistedBuyer: undefined,
})

// Lock the NFT against further metadata changes
const lockItem = Nfts.lockItemProperties({
  collection,
  item,
  lockMetadata: true,
  lockAttributes: true,
})

// Limit NFTs for this collection to 1, preventing further minting
const setCollectionMaxSupply = Nfts.setCollectionMaxSupply({ collection, maxSupply: 1 })

// Lock collection to prevent changes to the NFT limit
// TODO: enum helper
const lockCollection = Nfts.lockCollection({ collection, lockSettings: 8n })

// Send the batched extrinsics:
await Utility
  .batchAll({
    calls: Rune.tuple([
      setCollectionMetadata,
      setItemMetadata,
      setItemPrice,
      lockItem,
      setCollectionMaxSupply,
      lockCollection,
    ]),
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Batched calls:")
  .finalized()
  .run()

// Get the price of the NFT
const price = await Nfts.ItemPriceOf
  .value(Rune.tuple([collection, item]))
  .unhandle(undefined)
  .access(0)
  .run()
console.log(price)

// Buy the NFT using Bob's address
await Nfts
  .buyItem({
    collection: collection,
    item: item,
    bidPrice: price,
  })
  .signed(signature({ sender: bob }))
  .sent()
  .dbgStatus("Buying Item:")
  .finalized()
  .run()

// Check for Bob's new ownership of the NFT
const owner = await Nfts.Item
  .value(Rune.tuple([collection, item]))
  .unhandle(undefined)
  .access("owner")
  .run()
console.log("Owner:", owner)
