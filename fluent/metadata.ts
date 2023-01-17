import * as M from "../frame_metadata/mod.ts"
import { Args, Rune } from "../rune/mod.ts"
import { ClientRune } from "./client.ts"
import { CodecRune } from "./codec.ts"
import { PalletRune } from "./pallet.ts"

export class MetadataRune<out U> extends Rune<M.Metadata, U> {
  constructor(_prime: MetadataRune<U>["_prime"], readonly client: ClientRune<U>) {
    super(_prime)
  }

  pallet<X>(...[palletName]: Args<X, [palletName: string]>) {
    return Rune
      .ls([this.as(), palletName])
      .pipe(([metadata, palletName]) => M.getPallet(metadata, palletName))
      .unwrapError()
      .subclass(PalletRune, this)
  }

  deriveCodec = this.pipe((x) => M.DeriveCodec(x.tys))

  codec<X>(...[ty]: Args<X, [ty: number | M.Ty]>) {
    return Rune.ls([this.deriveCodec, ty]).pipe(([derive, ty]) => derive(ty)).subclass(CodecRune)
  }
}
