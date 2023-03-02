import { Uniques } from "zombienet/statemine.toml/collator/@latest/mod.ts";
import {
  alice,
  bob,
  Chain,
  ExtrinsicRune,
  Rune,
  RunicArgs,
  Sr25519,
  ValueRune,
} from "capi";
import {
  CollectionDetails,
  ItemDetails,
} from "http://localhost:4646/frame/zombienet/zombienets/statemine.toml/collator/@v0.9.370/types/pallet_uniques/types.ts";

const sendAndDebug =
  <X>(...[sender, prefix]: RunicArgs<X, [sender: Sr25519, prefix: String]>) =>
  <U, C extends Chain = Chain>(extrinsic: ExtrinsicRune<U, C>) => {
    return extrinsic.signed({ sender }).sent().dbgStatus(prefix);
  };

// Create Collection and Asset

const COLLECTION_ID = 1;

const createCollection = Uniques.create({
  collection: COLLECTION_ID,
  admin: alice.address,
});

const setCollectionMetadata = Uniques.setCollectionMetadata({
  collection: COLLECTION_ID,
  isFrozen: true, // freeze collections metadata
  data: new Uint8Array(),
});

const ASSET_ID = 1;

const mintAsset = Uniques.mint({
  collection: COLLECTION_ID,
  item: ASSET_ID,
  owner: alice.address,
});

const setAssetMetadata = Uniques.setMetadata({
  collection: COLLECTION_ID,
  item: ASSET_ID,
  isFrozen: true, // freeze assets metadata
  data: new Uint8Array(),
});

const setAssetPrice = Uniques.setPrice({
  collection: COLLECTION_ID,
  item: ASSET_ID,
  price: 1000000n,
  whitelistedBuyer: undefined,
});

// prevent new mints in collection
const setCollectionMaxSupply = Uniques.setCollectionMaxSupply({
  collection: COLLECTION_ID,
  maxSupply: 1,
});

const alicePrepareCollection = Rune
  .chain(() => createCollection.pipe(sendAndDebug(alice, "Create Collection:")))
  .chain(() =>
    setCollectionMetadata.pipe(sendAndDebug(alice, "Set Collection Metadata:"))
  )
  .chain(() => mintAsset.pipe(sendAndDebug(alice, "Mint Asset:")))
  .chain(() =>
    setAssetMetadata.pipe(sendAndDebug(alice, "Set Asset Metadata:"))
  )
  .chain(() => setAssetPrice.pipe(sendAndDebug(alice, "Set Asset Price:")))
  .chain(() =>
    setCollectionMaxSupply.pipe(
      sendAndDebug(alice, "Set Collection Max Supply:"),
    )
  );

// List Collections, Assets, and buy first asset from first collection

const getCollections = Uniques.Class.entryPage(50).into(ValueRune);

const firstCollection = <X>(
  collections: ValueRune<[[number], CollectionDetails][], X>,
) =>
  collections.map(([first, ..._rest]) => first?.[0][0]).unhandle(undefined)
    .into(ValueRune);

// TODO: should use RunicArgs?
const getCollectionAssets = <X>(collectionId: Rune<number, X>) =>
  Uniques.Asset.entryPage(50, [collectionId]).into(ValueRune);

const firstAsset = <X>(
  assets: ValueRune<[[number, number], ItemDetails][], X>,
) =>
  assets.map(([first, ..._rest]) => first?.[0][1]).unhandle(undefined).into(
    ValueRune,
  );

const getItemPrice = <X>(
  ...args: RunicArgs<X, [collectionId: number, assetId: number]>
) => {
  return Uniques.ItemPriceOf.entry(Rune.tuple(args)).unhandle(undefined).map((
    [price],
  ) => price);
};

const buyAsset = <X>(
  ...[collectionId, assetId, bidPrice]: RunicArgs<
    X,
    [collectionId: number, assetId: number, bidPrice: bigint]
  >
) => {
  return Uniques.buyItem({ collection: collectionId, item: assetId, bidPrice });
};

const collectionId = getCollections.chain(firstCollection);
const assetId = getCollectionAssets(collectionId).chain(firstAsset);
const price = getItemPrice(collectionId, assetId);

const bobBuyAsset = buyAsset(collectionId, assetId, price).pipe(
  sendAndDebug(bob, "Buying Asset:"),
);

// Query asset details & verify new owner

// const collectionDetails = Uniques.Class.entry(Rune.tuple([collectionId])).unhandle(undefined);

const assetDetails = Uniques.Asset.entry(Rune.tuple([collectionId, assetId]))
  .unhandle(undefined);

const showAssetOwner = assetDetails.access("owner").dbg("New Owner:");

const program = Rune
  .chain(() => alicePrepareCollection)
  .chain(() => bobBuyAsset)
  .chain(() => showAssetOwner);

await program.run();

console.log("done");
