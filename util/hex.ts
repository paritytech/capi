import * as hex from "std/encoding/hex.ts";

export function trim0x(prefixedHexStr: string): string {
  return prefixedHexStr.substring(2);
}

// TODO: utilize `trim0x` from `hexToU8a` site (not directly within `hexToU8a`)
export function hexToU8a(hexStr: string) {
  return hex.decode(new TextEncoder().encode(hexStr.substring(2)));
}

export function u8aToHex(bytes: Uint8Array): string {
  return new TextDecoder().decode(hex.encode(bytes));
}
