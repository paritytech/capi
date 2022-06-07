import * as M from "/frame_metadata/mod.ts";
import * as generated from "./bindings.generated.js";

export { instantiate as getBindings } from "./bindings.generated.js";

const hashers: M.HasherLookup = {
  [M.HasherKind.Blake2_128]: generated.blake2_128,
  [M.HasherKind.Blake2_128Concat]: generated.blake2_128Concat,
  [M.HasherKind.Blake2_256]: generated.blake2_256,
  [M.HasherKind.Identity]: (x) => x,
  [M.HasherKind.Twox128]: generated.twox128,
  [M.HasherKind.Twox256]: generated.twox256,
  [M.HasherKind.Twox64Concat]: generated.twox64Concat,
};

export async function getHashers(): Promise<M.HasherLookup> {
  await generated.instantiate();
  return hashers;
}
