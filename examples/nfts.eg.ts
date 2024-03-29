/**
 * @title NFTs
 * @description An example using the upcoming NFTs pallet to create an NFT collection,
 * mint, list and purchase an NFT, as well as lock the collection and NFT as to prevent.
 * @test_skip
 */

import {
  CollectionConfig,
  MintSettings,
  MintType,
  rococoDevWestmint,
} from "@capi/rococo-dev-westmint"
import { assertEquals } from "asserts"
import { $, createDevUsers, is, Rune } from "capi"
import { signature } from "capi/patterns/signature/statemint"
import { DefaultCollectionSetting, DefaultItemSetting } from "capi/patterns/unstable/nfts"

/// Create two dev users. Alexa will mint and list the NFT. Billy will purchase it.
const { alexa, billy } = await createDevUsers()

/// Create a collection and get the resulting collection ID.
const collection = await rococoDevWestmint.Nfts
  .create({
    config: CollectionConfig({
      settings: DefaultCollectionSetting.AllOff,
      mintSettings: MintSettings({
        mintType: MintType.Issuer(),
        defaultItemSettings: DefaultItemSetting.AllOff,
      }),
    }),
    admin: alexa.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Create collection:")
  .finalizedEvents("Nfts", "Created")
  .access(0, "event", "value", "collection")
  .run()

/// Ensure the collection id is a number.
$.assert($.u32, collection)
console.log("Collection id:", collection)

/// We'll create a single NFT with the id of 46
const item = 46

/// Mint an item to the collection.
await rococoDevWestmint.Nfts
  .mint({
    collection,
    item,
    mintTo: alexa.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Mint the NFT:")
  .finalized()
  .run()

const owner = rococoDevWestmint.Nfts.Item
  .value([collection, item])
  .unhandle(is(undefined))
  .access("owner")

/// Retrieve the final owner.
const initialOwner = await owner.run()

/// Ensure Alexa is the initial owner.
console.log("Initial owner:", initialOwner)
assertEquals(initialOwner, alexa.publicKey)

/// Submit a batch, which reverts if any calls fail. The contained calls do the following:
///
/// 1. Set the price.
/// 2. Prevent further minting.
/// 3. Lock the collection to prevent changes.
const price = 1000000n
await rococoDevWestmint.Utility
  .batchAll({
    calls: Rune.array([
      rococoDevWestmint.Nfts.setPrice({ collection, item, price }),
      rococoDevWestmint.Nfts.setCollectionMaxSupply({ collection, maxSupply: 1 }),
      rococoDevWestmint.Nfts.lockCollection({ collection, lockSettings: 8n }), /// TODO: enum helper
    ]),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Sale prep:")
  .finalized()
  .run()

/// Retrieve the price of the NFT.
const bidPrice = await rococoDevWestmint.Nfts.ItemPriceOf
  .value([collection, item])
  .unhandle(is(undefined))
  .access(0)
  .run()

/// Ensure the `bidPrice` is the expected value.
console.log(bidPrice)
assertEquals(price, bidPrice)

/// Buy the NFT as Billy.
await rococoDevWestmint.Nfts
  .buyItem({ collection, item, bidPrice })
  .signed(signature({ sender: billy }))
  .sent()
  .dbgStatus("Purchase:")
  .finalized()
  .run()

/// Retrieve the final owner.
const finalOwner = await owner.run()

/// Ensure Billy is the final owner.
console.log("Final owner:", finalOwner)
assertEquals(finalOwner, billy.publicKey)
