import * as M from "../frame_metadata/mod.ts";

import * as hasherBindings from "./hashers/mod.generated.js";

export { instantiate as getSr25519 } from "./sr25519/mod.generated.js";
export { instantiate as getSs58 } from "./ss58/mod.generated.js";

export async function getHashers(): Promise<M.HasherLookup> {
  await hasherBindings.instantiate();
  return {
    [M.HasherKind.Blake2_128]: hasherBindings.blake2_128,
    [M.HasherKind.Blake2_128Concat]: hasherBindings.blake2_128Concat,
    [M.HasherKind.Blake2_256]: hasherBindings.blake2_256,
    [M.HasherKind.Identity]: (x) => x,
    [M.HasherKind.Twox128]: hasherBindings.twox128,
    [M.HasherKind.Twox256]: hasherBindings.twox256,
    [M.HasherKind.Twox64Concat]: hasherBindings.twox64Concat,
  };
}
