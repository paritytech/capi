import * as M from "../frame_metadata/mod.ts"
import { Rune, RunicArgs } from "../rune/mod.ts"
import { ConstRune } from "./const.ts"
import { MetadataRune } from "./metadata.ts"
import { StorageRune } from "./storage.ts"

export class PalletRune<out U> extends Rune<M.Pallet, U> {
  constructor(_prime: PalletRune<U>["_prime"], readonly metadata: MetadataRune<U>) {
    super(_prime)
  }

  storage<X>(...[storageName]: RunicArgs<X, [storageName: string]>) {
    return Rune
      .tuple([this.into(), storageName])
      .map(([metadata, palletName]) => M.getStorage(metadata, palletName))
      .unhandle(M.StorageNotFoundError)
      .into(StorageRune, this)
  }

  const<X>(...[constName]: RunicArgs<X, [constantName: string]>) {
    return Rune
      .tuple([this.into(), constName])
      .map(([metadata, constName]) => M.getConst(metadata, constName))
      .unhandle(M.ConstNotFoundError)
      .into(ConstRune, this)
  }
}
