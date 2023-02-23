import { Chain, ClientRune, Rune, RunicArgs } from "capi";
import {
  client,
  Uniques,
} from "zombienet/statemine.toml/collator/@latest/mod.ts";
import * as $ from "../deps/scale.ts";

/*
 *

//  Max 32 bytes per key
//  Max 64 bytes per value

// check cost for each operation
---

  Collection.ref()
  Item.ref()

 */

class CollectionFrozenError extends Error {
  override readonly name = "CannotFindAttemptError";
}
class AssetFrozenError extends Error {
  override readonly name = "CannotFindAttemptError";
}

type Id = number | Uint32Array;

type MetadataValue = Uint8Array | string | number;

type Metadata = Record<MetadataValue, MetadataValue>;

type Address = any;

class CollectionRune<
  out U,
  out C extends Chain,
> /*M extends Record<string, any>*/ extends Rune<number, U> {
  constructor(
    _prime: CollectionRune<U, C /*, M*/>["_prime"],
    readonly chain: ClientRune<U, C>,
    readonly owner: Address,
    readonly issuer: Address,
    readonly admin: Address,
    readonly freezer: Address,
    readonly totalDeposit: number,
    readonly freeHolding: boolean,
    /// The total number of outstanding items of this collection.
    private readonly itemCount: number,
    /// The total number of outstanding item metadata of this collection.
    private readonly metadataCount: number,
    /// The total number of attributes for this collection.
    private readonly attributesCount: number,
    /// Whether the collection is frozen for non-admin transfers.
    readonly frozen: boolean,
    // readonly codecs?: { [K in keyof M]: $.Codec<M[K]> },
  ) {
    super(_prime);
  }

  // static create<U, C extends Chain, M extends Record<string, any>>(
  //   chain: ClientRune<U, C>,
  //   codecs?: { [K in keyof M]: $.Codec<M[K]> },
  // ) {
  //   // use `chain` to get the next available id
  //   const id = null! as Rune<number>
  //   return id.into(CollectionRune, chain, codecs)
  // }

  static create(params: {
    id?: Id;
    // accepts a list of metadata or metadata and attributes (values)
    metadata?: MetadataValue[] | Metadata;
    owner: Address;
    admin?: Address;
    issuer?: Address;
    freezer?: Address;
    frozen?: boolean;
    maxSupply?: number;
    force?: boolean;
    freeHolding?: boolean; // used with force
  }) {
    params;
    // const id = id ?? nextId()
    // if (forceCreate)
    //   Uniques.forceCreate(id, owner, freeHolding)
    // else
    //   Uniques.create(id, admin)
    // if (maxSupply)
    // Uniques.setCollectionMaxSupply(collection, maxSupply)
    // if (metadata is MetadataValue[])
    //   foreach key
    //     Uniques.setCollectionMetadata(collection, data, isFrozen)
    // if (metadata is Metadata)
    //   foreach [value, key]
    //     Uniques.setCollectionMetadata(collection, data, isFrozen)
    //     Uniques.setAttribute(collection, maybeItem, key, value)
    // if (admin || issuer || freezer)
    //   Uniques.setTeam(collection, issuer, admin, freezer)
  }

  /// Disallow further unprivileged transfers for collection.
  freeze() {
    // return Uniques.freezeCollection(this.id);
  }

  // Reevaluate the deposits on some items
  redeposit<X>(...[items]: RunicArgs<X, [items: (Item | number)[]]>) {
    // return Uniques.redeposit(this.id, mapItems(items))
  }

  /// Set (or reset) the acceptance of ownership for a particular account.
  acceptOwnership() {
    // return Uniques.setAcceptOwnership(this.id) owner
  }

  /// Re-allow unprivileged transfers
  thaw() {
    // return Uniques.thawCollection(this.id)
  }

  // Change the Owner
  transfer(owner: Address) {
    // return Uniques.transferOwnership(this.id, owner)
  }

  // Destroy this collection
  destroy() {
    // return Uniques.destroy(this.id, { items: this.items.count, itemMetadatas: this.metadataCount, attributes: this.attributesCount })
  }

  ///

  item(id: number) {}

  items(count: number, start?: number) {}

  mint(id: number, to: Uint8Array) {
  }
}

type Item = any;

// - forceItemStatus(collection, owner, issuer, admin, freezer, freeHolding, isFrozen)
// Alter the attributes of a given item.
// - freeze(collection, item)
// Disallow further unprivileged transfer of an item.
// - setAttribute(collection, maybeItem, key, value)
// Set an attribute for a collection or item.
// - thaw(collection, item)
// Re-allow unprivileged transfer of an item.
// - transfer(collection, item, dest)
// Move an item from the sender account to another.

// type Item = UncreatedAsset | ItemRef | LoadedItem
// create({
//   id?: Id
//   collectionId: Collection | Id,
//   owner: Address,
//   metadata?: MetadataValue[] | Metadata,
//   frozen?: bool,
//   attributes?: Record<MetadataValue, MetadataValue>
//   price?: double,
// }) {
//   Uniques.mint(collection, item, owner)
//   if (metadata is MetadataValue[])
//     foreach key
//       Uniques.setMetadata(collection, item, data, isFrozen)
//   if (metadata is Metadata)
//     foreach [value, key]
//       Uniques.setMetadata(collection, item, data, isFrozen)
//       Uniques.setAttribute(collection, maybeItem, key, value)
//   if (price)
//     Uniques.setPrice(collection, item, price, whitelistedBuyer)
// }

// const newCollection = CollectionRune.create(client, {
//   colors: $.array($.str),
// });

// const existingCollection = CollectionRune.from(1, client, {
//   colors: $.array($.str),
// });
