import { Hex } from "./branded.ts"

export { decode as decodeBuf, encode as encodeBuf } from "../deps/std/encoding/hex.ts"

export function decode(hex: string): Uint8Array {
  if (hex.startsWith("0x")) hex = hex.slice(2)
  if (hex.length % 2 === 1) hex = "0" + hex
  const array = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i++) {
    array[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return array
}

export function encode(bytes: Uint8Array): Hex {
  let str = ""
  for (let i = 0; i < bytes.length; i++) {
    str += bytes[i]!.toString(16).padStart(2, "0")
  }
  return str as Hex
}

export function encodePrefixed(bytes: Uint8Array): Hex {
  return ("0x" + encode(bytes)) as Hex
}
