import { decompress } from "../_deps/lz4.ts";
import * as M from "../frame_metadata/mod.ts";
import { instantiate } from "./mod.generated.mjs";

export async function Hashers(): Promise<M.HasherLookup> {
  const instance = await instantiate(decompress);
  return {
    Blake2_128: instance.blake2_128,
    Blake2_128Concat: instance.blake2_128Concat,
    Blake2_256: instance.blake2_256,
    Identity: (x) => x,
    Twox128: instance.twox128,
    Twox256: instance.twox256,
    Twox64Concat: instance.twox64Concat,
  };
}
