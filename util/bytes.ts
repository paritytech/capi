export * from "../deps/std/bytes.ts"

export function compare(a: Uint8Array, b: Uint8Array): number {
  for (let i = 0; i < a.byteLength; i++) {
    if (a[i]! < b[i]!) {
      return -1
    }

    if (a[i]! > b[i]!) {
      return 1
    }
  }

  return a.byteLength > b.byteLength ? 1 : a.byteLength < b.byteLength ? -1 : 0
}
