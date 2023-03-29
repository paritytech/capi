import { array, Codec, transform, tuple } from "https://deno.land/x/scale@v0.11.0/mod.ts#="

export * from "https://deno.land/x/scale@v0.11.0/mod.ts#="

export function record<K extends keyof any, V>(key: Codec<K>, value: Codec<V>) {
  return transform<[K, V][], Record<K, V>>({
    $base: array(tuple(key, value)),
    encode: Object.entries as (value: Record<K, V>) => [K, V][],
    decode: Object.fromEntries,
  })
}
