import * as M from "../frame_metadata/mod.ts";

import * as hasherBindings from "./hashers/mod.generated.js";

export { instantiate as getSr25519 } from "./sr25519/mod.generated.js";
export { instantiate as getSs58 } from "./ss58/mod.generated.js";

export async function getHashers(): Promise<M.HasherLookup> {
  await hasherBindings.instantiate();
  return {
    Blake2_128: hasherBindings.blake2_128,
    Blake2_128Concat: hasherBindings.blake2_128Concat,
    Blake2_256: hasherBindings.blake2_256,
    Identity: (x) => x,
    Twox128: hasherBindings.twox128,
    Twox256: hasherBindings.twox256,
    Twox64Concat: hasherBindings.twox64Concat,
  };
}
