import { Effect, MaybeEffect } from "/effect/Base.ts";
import { DeriveCodec } from "/effect/core/DeriveCodec.ts";
import * as s from "x/scale/mod.ts";

export class Codec<
  Beacon,
  TypeI extends MaybeEffect<number>,
> extends Effect<[Beacon, TypeI, DeriveCodec<Beacon>], s.Codec<unknown>, never, {}> {
  constructor(
    readonly beacon: Beacon,
    readonly typeI: TypeI,
  ) {
    super([beacon, typeI, new DeriveCodec(beacon)], (_, typeI, deriveCodec) => {
      return async () => {
        return deriveCodec(typeI);
      };
    });
  }
}
