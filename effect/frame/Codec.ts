import { AnyEffect, AnyEffectA, Effect } from "/effect/Base.ts";
import { DeriveCodec, deriveCodec } from "/effect/primitive/DeriveCodec.ts";
import * as s from "x/scale/mod.ts";

export class CodecError extends Error {}

export interface CodecResolved {
  decoded: unknown;
}

export class Codec<
  Beacon extends AnyEffect,
  TypeI extends AnyEffectA<number>,
> extends Effect<{}, CodecError, s.Codec, [DeriveCodec<Beacon>, TypeI]> {
  constructor(
    beacon: Beacon,
    typeI: TypeI,
  ) {
    super([deriveCodec(beacon), typeI], async (_, deriveCodecResolved, typeIResolved) => {
      return deriveCodecResolved(typeIResolved);
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
