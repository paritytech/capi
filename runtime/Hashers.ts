import * as m from "/frame_metadata/mod.ts";
import * as h from "/target/wasm/crypto/mod.js";

export interface HasherRuntime {
  hashers: m.HasherLookup;
}

export const hashers: m.HasherLookup = {
  [m.HasherKind.Blake2_128]: h.blake2_128,
  [m.HasherKind.Blake2_128Concat]: h.blake2_128Concat,
  [m.HasherKind.Blake2_256]: h.blake2_256,
  [m.HasherKind.Identity]: h.identity,
  [m.HasherKind.Twox128]: h.twox128,
  [m.HasherKind.Twox256]: h.twox256,
  [m.HasherKind.Twox64Concat]: h.twox64Concat,
};
