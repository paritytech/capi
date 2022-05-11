// import { AnyEffect, AnyEffectA, Effect } from "/effect/Base.ts";
// import * as hex from "std/encoding/hex.ts";
// import { DecodeSs58Runtime, DecodeSs58RuntimeError } from "../runtime/DecodeSs58.ts";

// export interface PubKeyResolved {
//   bytes: Uint8Array;
// }

// export class PubKey<
//   R,
//   E extends Error,
//   D extends AnyEffect[],
// > extends Effect<R, E, PubKeyResolved, D> {}

// export namespace PubKey {
//   export const fromSs58Text = <Ss58Text extends AnyEffectA<string>>(
//     ss58Text: Ss58Text,
//   ): PubKey<DecodeSs58Runtime, DecodeSs58RuntimeError, [Ss58Text]> => {
//     return new PubKey([ss58Text], async (runtime, resolved) => {
//       return {
//         bytes: hex.decode(runtime.decodeSs58(resolved)),
//       };
//     });
//   };
// }
