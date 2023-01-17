import * as M from "../frame_metadata/mod.ts"
import { Args, Rune } from "../rune/mod.ts"
import { ConstRune } from "./const.ts"
import { MetadataRune } from "./metadata.ts"
import { StorageRune } from "./storage.ts"

export class PalletRune<out U> extends Rune<M.Pallet, U> {
  constructor(_prime: PalletRune<U>["_prime"], readonly metadata: MetadataRune<U>) {
    super(_prime)
  }

  storage<X>(...[storageName]: Args<X, [storageName: string]>) {
    return Rune
      .ls([this.as(), storageName])
      .pipe(([metadata, palletName]) => M.getStorage(metadata, palletName))
      .unwrapError()
      .subclass(StorageRune, this)
  }

  const<X>(...[constName]: Args<X, [constantName: string]>) {
    return Rune
      .ls([this.as(), constName])
      .pipe(([metadata, constName]) => M.getConst(metadata, constName))
      .unwrapError()
      .subclass(ConstRune, this)
  }
}
