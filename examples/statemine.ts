import { Chain, ClientRune, Rune, RunicArgs } from "capi"
import { client, Uniques } from "zombienet/statemine.toml/collator/@latest/mod.ts"
import * as $ from "../deps/scale.ts"

class CollectionRune<out U, out C extends Chain, M extends Record<string, any>>
  extends Rune<number, U>
{
  constructor(
    _prime: CollectionRune<U, C, M>["_prime"],
    readonly client: ClientRune<U, C>,
    readonly codecs?: { [K in keyof M]: $.Codec<M[K]> },
  ) {
    super(_prime)
  }

  static create<U, C extends Chain, M extends Record<string, any>>(
    chain: ClientRune<U, C>,
    codecs?: { [K in keyof M]: $.Codec<M[K]> },
  ) {
    // use `chain` to get the next available id
    const id = null! as Rune<number>
    return id.into(CollectionRune, chain, codecs)
  }

  static from<U, C extends Chain, M extends Record<string, any>, X>(
    id: RunicArgs<X, [number]>[0],
    chain: ClientRune<U, C>,
    codecs?: { [K in keyof M]: $.Codec<M[K]> },
  ) {
    return Rune.resolve(id).into(CollectionRune, chain, codecs)
  }

  nextId() {
    // ...
  }

  item(id: number) {}

  items(count: number, start?: number) {}

  mint(id: number, to: Uint8Array) {}
}

const newCollection = CollectionRune.create(client, {
  colors: $.array($.str),
})

const existingCollection = CollectionRune.from(1, client, {
  colors: $.array($.str),
})
