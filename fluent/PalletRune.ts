import * as M from "../frame_metadata/mod.ts"
import { Rune, RunicArgs } from "../rune/mod.ts"
import { ConstRune } from "./ConstRune.ts"
import { MetadataRune } from "./MetadataRune.ts"
import { StorageRune } from "./StorageRune.ts"

export class PalletRune<out U> extends Rune<M.Pallet, U> {
  constructor(_prime: PalletRune<U>["_prime"], readonly metadata: MetadataRune<U>) {
    super(_prime)
  }

  storage<X>(...[storageName]: RunicArgs<X, [storageName: string]>) {
    return Rune
      .tuple([this.as(Rune), storageName])
      .map(([metadata, palletName]) => M.getStorage(metadata, palletName))
      .unhandle(M.StorageNotFoundError)
      .into(StorageRune, this)
  }

  const<X>(...[constName]: RunicArgs<X, [constantName: string]>) {
    return Rune
      .tuple([this.as(Rune), constName])
      .map(([metadata, constName]) => M.getConst(metadata, constName))
      .unhandle(M.ConstNotFoundError)
      .into(ConstRune, this)
  }
}
