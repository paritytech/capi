import * as M from "../frame_metadata/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { DeriveCodec, Ty } from "../scale_info/mod.ts"
import { Chain, ChainRune } from "./ChainRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { PalletRune } from "./PalletRune.ts"

export class MetadataRune<out U, out C extends Chain = Chain> extends Rune<M.Metadata, U> {
  constructor(_prime: MetadataRune<U>["_prime"], readonly chain: ChainRune<U, C>) {
    super(_prime)
  }

  pallet<X>(...[palletName]: RunicArgs<X, [palletName: string]>) {
    return Rune
      .tuple([this.as(Rune), palletName])
      .map(([metadata, palletName]) => M.getPallet(metadata, palletName))
      .unhandle(M.PalletNotFoundError)
      .into(PalletRune, this)
  }

  deriveCodec = this.into(ValueRune).map((x) => DeriveCodec(x.tys))

  codec<X>(...[ty]: RunicArgs<X, [ty: number | Ty]>) {
    return Rune.tuple([this.deriveCodec, ty]).map(([derive, ty]) => derive(ty)).into(CodecRune)
  }
}
