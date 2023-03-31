import { $, alice, bob, Event as CapiEvent, Rune, ValueRune } from "capi"
import { signature } from "capi/patterns/signature/nft.ts"
import { Nfts, Utility, WestmintLocal } from "zombienet/nfts.toml/collator/@latest/mod.js"
import { Event } from "zombienet/nfts.toml/collator/@latest/types/pallet_nfts/pallet.js"
import { MintType } from "zombienet/nfts.toml/collator/@latest/types/pallet_nfts/types.js"
import { RuntimeEvent } from "zombienet/nfts.toml/collator/@latest/types/westmint_runtime.js"

// The nfts pallet uses inverted bitflags; on means exclude and off means include.
const DefaultCollectionSetting = {
  TransferableItems: 1n << 0n,
  UnlockedMetadata: 1n << 1n,
  UnlockedAttributes: 1n << 2n,
  UnlockedMaxSupply: 1n << 3n,
  DepositRequired: 1n << 4n,
  allOff: 0n,
  allOn: 0b11111n,
}
const DefaultItemSetting = {
  Transferable: 1n << 0n,
  UnlockedMetadata: 1n << 1n,
  UnlockedAttributes: 1n << 2n,
  allOff: 0n,
  allOn: 0b111n,
}

// Create a collection
const createCollection = await Nfts
  .create({
    config: Rune.rec({
      settings: DefaultCollectionSetting.allOn,
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

// Extract the collection's id from emitted events
const collection = await createCollection
  .into(ValueRune)
  .map(getCollectionIdFromEvents)
  .unhandle(undefined)
  .dbg("Collection Id:")
  .run()

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

// Create and encode metadata for the collection
const collectionMetadata = $.object($.field("name", $.str)).encode({ name: "Collection 01" })

/// The following extrinsics will first be created, then batched to be sent together:

// Set the collection's metadata
const setCollectionMetadata = Nfts
  .setCollectionMetadata({
    collection,
    data: collectionMetadata,
  })

// Create and encode metadata for the NFT
const itemMetadata = $.object($.field("name", $.str)).encode({ name: "NFT #01" })

// Set the NFT's metadata
const setItemMetadata = Nfts
  .setMetadata({
    collection,
    item,
    data: itemMetadata,
  })

// Set the NFT's price
const setItemPrice = Nfts
  .setPrice({
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
const setCollectionMaxSupply = Nfts
  .setCollectionMaxSupply({
    collection,
    maxSupply: 1,
  })

// Lock collection to prevent changes to the NFT limit
const lockCollection = Nfts.lockCollection({
  collection,
  lockSettings: 8n, // TODO: enum helper
})

// Send the batched extrinsics:
await Utility.batchAll({
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

// Get the price of the NFT
const price = await Nfts.ItemPriceOf
  .value(Rune.tuple([collection, item]))
  .unhandle(undefined)
  .access(0)
  .dbg("Price:")
  .run()

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
console.log(
  "Owner:",
  await Nfts.Item
    .value(Rune.tuple([collection, item]))
    .unhandle(undefined)
    .access("owner")
    .run(),
)

// Utility function for extracting id from CreateCollection events
function getCollectionIdFromEvents(events: CapiEvent<WestmintLocal>[]) {
  const event = events.find((event) =>
    RuntimeEvent.isNfts(event.event) && Event.isCreated(event.event.value)
  )?.event.value as Event.Created | undefined
  return event?.collection
}
