import * as V from "/env/mod.ts";
import * as M from "/frame_metadata/mod.ts";
import * as C from "/target/wasm/crypto/mod.js";

export const hashersR: V.HashersR = {
  hashers: {
    [M.HasherKind.Blake2_128]: C.blake2_128,
    [M.HasherKind.Blake2_128Concat]: C.blake2_128Concat,
    [M.HasherKind.Blake2_256]: C.blake2_256,
    [M.HasherKind.Identity]: (x) => x,
    [M.HasherKind.Twox128]: C.twox128,
    [M.HasherKind.Twox256]: C.twox256,
    [M.HasherKind.Twox64Concat]: C.twox64Concat,
  },
};

export const decodeSs58R: V.DecodeSs58R = {
  decodeSs58Text: C.decodeSs58Text,
};
