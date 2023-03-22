import {
  Nfts,
  WestmintLocal,
} from "http://localhost:4646/frame/zombienet/zombienets/nfts.toml/collator/@latest/mod.js"
import { Event } from "http://localhost:4646/frame/zombienet/zombienets/nfts.toml/collator/@latest/types/pallet_nfts/pallet.js"
import {
  MintType,
  MintWitness,
} from "http://localhost:4646/frame/zombienet/zombienets/nfts.toml/collator/@latest/types/pallet_nfts/types.js"
import { RuntimeEvent } from "http://localhost:4646/frame/zombienet/zombienets/nfts.toml/collator/@latest/types/westmint_runtime.js"
import { ItemTip } from "http://localhost:4646/frame/zombienet/zombienets/nfts.toml/collator/@v0.9.370/types/pallet_nfts/types.js"
import { DestroyWitness } from "http://localhost:4646/frame/zombienet/zombienets/nfts.toml/collator/@v0.9.370/types/pallet_uniques/types.ts"
import { MultiAddress } from "http://localhost:4646/frame/zombienet/zombienets/nfts.toml/collator/@v0.9.370/types/sp_runtime/multiaddress.js"

import {
  $,
  alice,
  Chain,
  ChainRune,
  ExtrinsicRune,
  Rune,
  RunicArgs,
  SignatureDataFactory,
  ValueRune,
} from "http://localhost:4646/mod.ts"
import { ItemRune } from "./mod.ts"

type CollectionSettings = {
  TransferableItems?: boolean
  UnlockedMetadata?: boolean
  UnlockedAttributes?: boolean
  UnlockedMaxSupply?: boolean
  DepositRequired?: boolean
}
type ItemSettings = {
  Transferable: boolean
  UnlockedMetadata: boolean
  UnlockedAttributes: boolean
}

type ExtractFns<T> = keyof { [K in keyof T as T[K] extends Function ? K : never]: T[K] }

export class CollectionRune<out C extends WestmintLocal, out U> extends Rune<number, U> {
  id
  // storage

  constructor(_prime: CollectionRune<C, U>["_prime"], readonly chain: ChainRune<C, U>) {
    super(_prime)
    // this.storage = this.chain.pallet("Nfts").storage("Collection")
    // const s = this.chain.metadata.access("pallets").access("Nfts").access("")
    const value = this.into(ValueRune)
    this.id = value
  }

  update<X>(
    props: RunicArgs<X, {
      admin?: MultiAddress
      issuer?: MultiAddress
      freezer?: MultiAddress
      attributes?: $.Codec<Record<any, any>>
      metadata?: $.Codec<any>
      settings: CollectionSettings
      maxSupply?: number
      mintSettings?: {
        mintType: MintType
        price?: number
        startBlock?: number
        endBlock?: number
        defaultItemSettings: ItemSettings
      }
    }>,
  ) {
    const _props = RunicArgs.resolve(props)
    const blocks: ExtrinsicRune<C, unknown>[] = []
    if (_props.admin ?? _props.issuer ?? _props.freezer) {
      blocks.push(
        this.setTeam({ admin: _props.admin, issuer: _props.issuer, freezer: _props.freezer }),
      )
    }
    if (props.mintSettings) {
      const c = _props.mintSettings!.unhandle(undefined).access("mintType")
      // blocks.push(
      //   this.updateMintSettings({
      //     mintType: _props.mintSettings.access("mintType"),
      //     defaultItemSettings: _props.mintSettings.access("defaultItemSettings"),
      //     price: _props.mintSettings?.access("price"),
      //   }),
      // )
    }
    if (_props.maxSupply) {
      blocks.push(this.setMaxSupply(_props.maxSupply.unhandle(undefined)))
    }
  }

  mint<X>(
    props: RunicArgs<X, { id: number; mintTo: MultiAddress; witness?: MintWitness }> & {
      sig: SignatureDataFactory<WestmintLocal, U, unknown>
    },
  ) {
    Nfts.mint({ collection: 21312, item: 123123, mintTo: alice.address })
    const mint = this.extrinsicBuilder("mint")
    const extrinsic = mint({
      item: this.id,
      mintTo: props.mintTo,
      witnessData: props.witness,
    })
    return Rune
      .chain(() => extrinsic.signed(props.sig).sent().finalized())
      .pipe(() => Rune.tuple([this.id, props.id]).into(ItemRune, this.chain))
  }

  static create<U>(props: {
    chain: ChainRune<WestmintLocal, U>
    admin: MultiAddress
    settings?: CollectionSettings
    maxSupply?: number
    mintSettings?: {
      mintType: MintType
      price?: number
      startBlock?: number
      endBlock?: number
      defaultItemSettings: ItemSettings
    }
    signatureFactory: SignatureDataFactory<WestmintLocal, U, unknown>
  }) {
    // const createCollection = Rune.rec({
    //   type: "Nfts",
    //   value: Rune.rec({
    //     type: "create",
    //     config: Rune.rec({
    //       settings: props.settings,
    //       mintSettings: Rune.rec({
    //         mintType: MintType.Issuer(),
    //         defaultItemSettings: props.mintSettings?.defaultItemSettings ?? 0n,
    //       }),
    //     }),
    //     admin: alice.address,
    //   }),
    // })
    //   .unsafeAs<Chain.Call<C>>()
    //   .into(ExtrinsicRune, props.chain)
    //   .signed(signature({sender: props.admin}) as any) // TODO sign externally
    //   .sent()
    //   .finalized()

    const createCollection = Nfts
      .create({
        config: Rune.rec({
          settings: 0n, // TODO
          mintSettings: Rune.rec({
            mintType: props.mintSettings?.mintType ?? MintType.Issuer(),
            defaultItemSettings: 0n, // TODO
          }),
        }),
        admin: props.admin,
      })
      .signed(props.signatureFactory)
      .sent()
      .dbgStatus("Create Collection:")
      .finalized()

    const collection = createCollection.events()
      .into(ValueRune)
      .map((events) => {
        const event = events.find((event) =>
          RuntimeEvent.isNfts(event.event) && Event.isCreated(event.event.value)
        )?.event.value as Event.Created | undefined
        return event?.collection
      })
      .unhandle(undefined)
    return collection.into(CollectionRune, props.chain)
  }

  destroy<X>(...props: RunicArgs<X, readonly [witness: DestroyWitness]>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "destroy",
        collection: this.id,
        witness: props[0],
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  burn<X>(...props: RunicArgs<X, readonly [item: number, checkOwner?: MultiAddress]>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "burn",
        collection: this.id,
        item: props[0],
        checkOwner: props[1],
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  redeposit<X>(...props: RunicArgs<X, readonly [items: number[]]>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "redeposit",
        collection: this.id,
        items: props[0],
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  lock<X>(...props: RunicArgs<X, readonly [settings: CollectionSettings]>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "lock_collection",
        collection: this.id,
        lockSettings: props[0],
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  transfer<X>(...props: RunicArgs<X, readonly [owner: MultiAddress]>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "transfer",
        collection: this.id,
        lockSettings: props[0],
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  setTeam<X>(
    props: RunicArgs<X, { issuer?: MultiAddress; admin?: MultiAddress; freezer?: MultiAddress }>,
  ) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "set_team",
        collection: this.id,
        issuer: props.issuer,
        admin: props.admin,
        freezer: props.freezer,
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  // set_accept_ownership<X>(props: RunicArgs<X, { collection?: number }>) {
  //   Nfts.setAcceptOwnership({maybeCollection})

  // }

  setMaxSupply<X>(...props: RunicArgs<X, readonly [maxSupply: number]>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "set_collection_max_supply",
        collection: this.id,
        maxSupply: props[0],
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  updateMintSettings<X>(
    mintSettings: RunicArgs<
      X,
      {
        mintType: MintType
        price?: number
        startBlock?: number
        endBlock?: number
        defaultItemSettings: ItemSettings
      }
    >,
  ) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "update_mint_settings",
        collection: this.id,
        ...mintSettings,
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  payTips<X>(...props: RunicArgs<X, readonly [items: ItemTip[]]>) {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: "pay_tips",
        collection: this.id,
        tips: props[0],
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  private extrinsicBuilder = <
    N extends typeof Nfts,
    M extends ExtractFns<N>,
    P extends N[M] extends (value: infer A) => any ? Omit<A, "collection"> : never,
  >(method: M) =>
  (props: P) => {
    return Rune.rec({
      type: "Nfts",
      value: Rune.rec({
        type: method,
        collection: this.id,
        ...props,
      }),
    })
      .unsafeAs<Chain.Call<C>>()
      .into(ExtrinsicRune, this.chain)
  }

  // set_attribute(
  //   collection: T::CollectionId,
  //   maybe_item: Option<T::ItemId>,
  //   namespace: AttributeNamespace<T::AccountId>,
  //   key: BoundedVec<u8, T::KeyLimit>,
  //   value: BoundedVec<u8, T::ValueLimit>,
  // ){

  // }
  // clear_attribute(
  //   collection: T::CollectionId,
  //   maybe_item: Option<T::ItemId>,
  //   namespace: AttributeNamespace<T::AccountId>,
  //   key: BoundedVec<u8, T::KeyLimit>,
  // ){

  // }
  // set_collection_metadata(
  //   collection: T::CollectionId,
  //   data: BoundedVec<u8, T::StringLimit>,
  // ){

  // }
  // clear_collection_metadata(
  //   collection: T::CollectionId,
  // ){

  // }
}
