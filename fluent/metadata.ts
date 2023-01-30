import * as M from "../frame_metadata/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { DeriveCodec, Ty } from "../scale_info/mod.ts"
import { ClientRune } from "./client.ts"
import { CodecRune } from "./codec.ts"
import { PalletRune } from "./pallet.ts"

export class MetadataRune<out U> extends Rune<M.Metadata, U> {
  constructor(_prime: MetadataRune<U>["_prime"], readonly client: ClientRune<U>) {
    super(_prime)
  }

  pallet<X>(...[palletName]: RunicArgs<X, [palletName: string]>) {
    return Rune
      .tuple([this.as(), palletName])
      .map(([metadata, palletName]) => M.getPallet(metadata, palletName))
      .unwrapError()
      .as(PalletRune, this)
  }

  deriveCodec = this.as(ValueRune).map((x) => DeriveCodec(x.tys))

  codec<X>(...[ty]: RunicArgs<X, [ty: number | Ty]>) {
    return Rune.tuple([this.deriveCodec, ty]).map(([derive, ty]) => derive(ty)).as(CodecRune)
  }
}
