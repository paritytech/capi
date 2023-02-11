import { getConst, getStorage, Pallet } from "../frame_metadata/mod.ts"
import { Rune, RunicArgs } from "../rune/mod.ts"
import { ConstRune } from "./ConstRune.ts"
import { MetadataRune } from "./MetadataRune.ts"
import { StorageRune } from "./StorageRune.ts"

export class PalletRune<out U> extends Rune<Pallet, U> {
  constructor(_prime: PalletRune<U>["_prime"], readonly metadata: MetadataRune<U>) {
    super(_prime)
  }

  storage<X>(...[storageName]: RunicArgs<X, [storageName: string]>) {
    return Rune
      .tuple([this.as(Rune), storageName])
      .map(([metadata, palletName]) => getStorage(metadata, palletName))
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant(new StorageNotFoundError()))
      .unhandle(StorageNotFoundError)
      .into(StorageRune, this.as(PalletRune))
  }

  const<X>(...[constName]: RunicArgs<X, [constantName: string]>) {
    return Rune
      .tuple([this.as(Rune), constName])
      .map(([metadata, constName]) => getConst(metadata, constName))
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant(new ConstNotFoundError()))
      .unhandle(ConstNotFoundError)
      .into(ConstRune, this.as(PalletRune))
  }
}

export class StorageNotFoundError extends Error {
  override readonly name = "StorageNotFoundError"
}

export class ConstNotFoundError extends Error {
  override readonly name = "ConstNotFoundError"
}
