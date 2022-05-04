import { AnyEffect, AnyEffectA, Effect } from "/effect/Base.ts";
import { DeriveCodec, deriveCodec } from "/effect/frame/DeriveCodec.ts";
import * as s from "x/scale/mod.ts";

export class CodecError extends Error {}

export class Codec<
  Beacon extends AnyEffect,
  TypeI extends AnyEffectA<number>,
> extends Effect<{}, CodecError, s.Codec<unknown>, [DeriveCodec<Beacon>, TypeI]> {
  constructor(
    readonly beacon: Beacon,
    readonly typeI: TypeI,
  ) {
    super([deriveCodec(beacon), typeI], async (_, deriveCodec, typeIResolved) => {
      return deriveCodec(typeIResolved);
    });
  }
}

export const codec = <
  Beacon extends AnyEffect,
  TypeI extends AnyEffectA<number>,
>(
  beacon: Beacon,
  typeI: TypeI,
): Codec<Beacon, TypeI> => {
  return new Codec(beacon, typeI);
};
