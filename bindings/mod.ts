import * as M from "/frame_metadata/mod.ts";
import * as bindings from "./bindings.generated.js";

export {
  base58Encode,
  decodeSs58Text,
  instantiate as init,
  pairFromSecretSeed,
  sign,
} from "./bindings.generated.js";

export const hashers: M.HasherLookup = {
  [M.HasherKind.Blake2_128]: bindings.blake2_128,
  [M.HasherKind.Blake2_128Concat]: bindings.blake2_128Concat,
  [M.HasherKind.Blake2_256]: bindings.blake2_256,
  [M.HasherKind.Identity]: (x) => x,
  [M.HasherKind.Twox128]: bindings.twox128,
  [M.HasherKind.Twox256]: bindings.twox256,
  [M.HasherKind.Twox64Concat]: bindings.twox64Concat,
};
