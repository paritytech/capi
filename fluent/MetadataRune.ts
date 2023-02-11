import { getPallet, Metadata } from "../frame_metadata/mod.ts"
import { Rune, RunicArgs, ValueRune } from "../rune/mod.ts"
import { DeriveCodec, Ty } from "../scale_info/mod.ts"
import { Chain, ClientRune } from "./ClientRune.ts"
import { CodecRune } from "./CodecRune.ts"
import { PalletRune } from "./PalletRune.ts"

export class MetadataRune<out U, out C extends Chain = Chain> extends Rune<Metadata, U> {
  constructor(_prime: MetadataRune<U>["_prime"], readonly client: ClientRune<U, C>) {
    super(_prime)
  }

  pallet<X>(...[palletName]: RunicArgs<X, [palletName: string]>) {
    return Rune
      .tuple([this.as(Rune), palletName])
      .map(([metadata, palletName]) => getPallet(metadata, palletName))
      .unhandle(undefined)
      .rehandle(undefined, () => Rune.constant(new PalletNotFoundError()))
      .unhandle(PalletNotFoundError)
      .into(PalletRune, this.as(MetadataRune))
  }

  deriveCodec = this.into(ValueRune).map((x) => DeriveCodec(x.tys))

  codec<X>(...[ty]: RunicArgs<X, [ty: number | Ty]>) {
    return Rune.tuple([this.deriveCodec, ty]).map(([derive, ty]) => derive(ty)).into(CodecRune)
  }
}

export class PalletNotFoundError extends Error {
  override readonly name = "PalletNotFoundError"
}

// export class TypeNotFoundError extends Error {
//   override readonly name = "TypeNotFoundError"
// }
