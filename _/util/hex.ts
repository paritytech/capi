import * as hex from "std/encoding/hex.ts";

export const hexToU8a = (hexStr: string) => {
  return hex.decode(new TextEncoder().encode(hexStr.substring(2)));
};
