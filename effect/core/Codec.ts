import { AnyResolvable, AnyResolvableA, Effect } from "/effect/Base.ts";
import { DeriveCodec } from "/effect/core/DeriveCodec.ts";
import * as s from "x/scale/mod.ts";

export class CodecError extends Error {}

export class Codec<
  Beacon extends AnyResolvable,
  TypeI extends AnyResolvableA<number>,
> extends Effect<{}, CodecError, s.Codec<unknown>, [DeriveCodec<Beacon>, TypeI]> {
  constructor(
    readonly beacon: Beacon,
    readonly typeI: TypeI,
  ) {
    super([new DeriveCodec(beacon), typeI], async (_, deriveCodec, typeIResolved) => {
      return deriveCodec(typeIResolved);
    });
  }
}
