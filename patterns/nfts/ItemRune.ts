import {
  WestmintLocal,
} from "http://localhost:4646/frame/zombienet/zombienets/nfts.toml/collator/@latest/mod.js"
import { CancelAttributesApprovalWitness } from "http://localhost:4646/frame/zombienet/zombienets/nfts.toml/collator/@v0.9.370/types/pallet_nfts/types.ts"
import { MultiAddress } from "http://localhost:4646/frame/zombienet/zombienets/nfts.toml/collator/@v0.9.370/types/sp_runtime/multiaddress.js"

import {
  Chain,
  ChainRune,
  ExtrinsicRune,
  Rune,
  RunicArgs,
  ValueRune,
} from "http://localhost:4646/mod.ts"

export class ItemRune<out C extends WestmintLocal, out U>
  extends Rune<readonly [collectionId: number, id: number], U>
{
  collectionId
  id
  storage

  constructor(_prime: ItemRune<C, U>["_prime"], readonly chain: ChainRune<C, U>) {
    super(_prime)
    this.storage = this.chain.pallet("Nfts").storage("Collection")
    const value = this.into(ValueRune)
    this.collectionId = value.access(0)
    this.id = value.access(1)
  }

  transfer<X>(...props: RunicArgs<X, readonly [dest: MultiAddress]>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "transfer",
        collection: this.collectionId,
        item: this.id,
        dest: props[0],
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  unlockTransfer<X>(...props: RunicArgs<X, readonly []>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "unlock_item_transfer",
        collection: this.collectionId,
        item: this.id,
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  approveTransfer<X>(...props: RunicArgs<X, readonly [delegate: MultiAddress, deadline?: number]>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "approve_transfer",
        collection: this.collectionId,
        item: this.id,
        delegate: props[0],
        deadline: props[1],
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  cancelApproval<X>(...props: RunicArgs<X, readonly [delegate: MultiAddress]>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "cancel_approval",
        collection: this.collectionId,
        item: this.id,
        delegate: props[0],
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  clearTransferApprovals_<X>(..._props: RunicArgs<X, readonly []>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "clear_all_transfer_approvals",
        collection: this.collectionId,
        item: this.id,
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  lock<X>(props: RunicArgs<X, { metadata?: boolean; attriutes?: boolean; transfer?: boolean }>) {
    // TODO
  }

  lockProperties<X>(props: RunicArgs<X, { lockMetadata: boolean; lockAttributes: boolean }>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "lock_item_properties",
        collection: this.collectionId,
        item: this.id,
        lockMetadata: props.lockMetadata,
        lockAttributes: props.lockAttributes,
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }
  approveAttributes<X>(...props: RunicArgs<X, readonly [delegate: MultiAddress]>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "approve_item_attributes",
        collection: this.collectionId,
        item: this.id,
        delegate: props[0],
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  cancelAttributesApproval<X>(
    ...props: RunicArgs<
      X,
      readonly [delegate: MultiAddress, witness: CancelAttributesApprovalWitness]
    >
  ) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "cancel_item_attributes_approval",
        collection: this.collectionId,
        item: this.id,
        delegate: props[0],
        witness: props[1],
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  clearMetadata() {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "clear_metadata",
        collection: this.collectionId,
        item: this.id,
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }
  // TOOD price optional
  setPrice<X>(...props: RunicArgs<X, readonly [price: bigint, witness?: MultiAddress]>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "set_price",
        collection: this.collectionId,
        item: this.id,
        price: props[0],
        whitelistedBuyer: props[1],
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  buy<X>(...props: RunicArgs<X, readonly [bidPrice: bigint]>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "buy_item",
        collection: this.collectionId,
        item: this.id,
        bidPrice: props[0],
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  // create_swap(
  //   offered_collection: T::CollectionId,
  //   offered_item: T::ItemId,
  //   desired_collection: T::CollectionId,
  //   maybe_desired_item: Option<T::ItemId>,
  //   maybe_price: Option<PriceWithDirection<<<T as Config<I>>::Currency as Currency<<T as SystemConfig>::AccountId>>::Balance>>,
  //   duration: <T as SystemConfig>::BlockNumber,
  // ){

  // }
  // cancel_swap(
  //   offered_collection: T::CollectionId,
  //   offered_item: T::ItemId,
  // ){

  // }
  // claim_swap(
  //   send_collection: T::CollectionId,
  //   send_item: T::ItemId,
  //   receive_collection: T::CollectionId,
  //   receive_item: T::ItemId,
  //   witness_price: Option<PriceWithDirection<<<T as Config<I>>::Currency as Currency<<T as SystemConfig>::AccountId>>::Balance>>,
  // ){

  // }
}
