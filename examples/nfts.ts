import { $, alice, bob, Event as CapiEvent, Rune, ValueRune } from "capi"
import { signature } from "capi/patterns/signature/nft.ts"
import { Nfts, WestmintLocal } from "zombienet/nfts.toml/collator/@latest/mod.js"
import { Event } from "zombienet/nfts.toml/collator/@latest/types/pallet_nfts/pallet.js"
import { MintType } from "zombienet/nfts.toml/collator/@latest/types/pallet_nfts/types.js"
import { RuntimeEvent } from "zombienet/nfts.toml/collator/@latest/types/westmint_runtime.js"

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

const createCollection = await Nfts
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
  .finalizedEvents()

const getCollectionIdFromEvents = (events: CapiEvent<WestmintLocal>[]) => {
  const event = events.find((event) =>
    RuntimeEvent.isNfts(event.event) && Event.isCreated(event.event.value)
  )?.event.value as Event.Created | undefined
  return event?.collection
}

// Create a collection and extract its id from the events
const collection = await createCollection
  .into(ValueRune)
  .map(getCollectionIdFromEvents)
  .unhandle(undefined)
  .dbg("Collection Id:")
  .run()

// Create and encode metadata for the collection
const collectionMetadata = $.object($.field("name", $.str)).encode({ name: "Collection 01" })

// Set the collection's metadata
await Nfts
  .setCollectionMetadata({
    collection,
    data: collectionMetadata,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Set Collection Metadata:")
  .finalized()

const item = 0

// Mint an item to the collection
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

// Create and encode metadata for the NFT
const itemMetadata = $.object($.field("name", $.str)).encode({ name: "NFT #01" })

// Set the NFT's metadata
await Nfts
  .setMetadata({
    collection,
    item,
    data: itemMetadata,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Set Item Metadata:")
  .finalized()

// Set the NFT's price
await Nfts
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

// Lock the NFT against further metadata changes
await Nfts.lockItemProperties({
  collection,
  item,
  lockMetadata: true,
  lockAttributes: true,
})
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Lock Item Properties:")
  .finalized()

// Limit NFTs for this collection to 1, preventing further minting
await Nfts
  .setCollectionMaxSupply({
    collection,
    maxSupply: 1,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Set Collection Max Supply:")
  .finalized()

// Lock collection to prevent changes to the NFT limit
await Nfts.lockCollection({
  collection,
  lockSettings: 8n, // TODO: enum helper
})
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Lock Collection:")
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
