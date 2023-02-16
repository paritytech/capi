import { alice, bob, charlie, dave, Rune, RunicArgs, Sr25519, ValueRune } from "capi"
import { Balances, System } from "westend_dev/mod.ts"
import { upperFirstCase } from "../deps/case.ts"

await aliceFree()
  .log(msg("Alice", "before"))
  .chain(() =>
    Object
      .entries({ bob, charlie, dave })
      .reduce<ValueRune<any, any>>((acc, args) =>
        acc
          .chain(() => beforeThenTxThenAfter(...args))
          .into(ValueRune), Rune.constant(undefined))
  )
  .chain(() => aliceFree().log(msg("Alice", "after")))
  .run()

function msg<X>(...[name, stage]: RunicArgs<X, [name: string, stage: "before" | "after"]>) {
  return Rune.str`${name} balance ${stage}:`
}

function aliceFree() {
  return System.Account.entry([alice.publicKey]).access("data", "free")
}

function beforeThenTxThenAfter<X>(...args: RunicArgs<X, [name: string, pair: Sr25519]>) {
  const pair = Rune.resolve(args[1])
  const name = Rune.resolve(args[0]).map(upperFirstCase)
  const free = () =>
    System.Account.entry(Rune.tuple([pair.access("publicKey")])).access("data", "free")
  return free()
    .log(msg(name, "before"))
    .chain(() =>
      Balances
        .transfer({
          dest: pair.access("address"),
          value: 1000123n,
        })
        .signed({ sender: alice })
        .sent()
        .logStatus(Rune.str`Transfer to ${name}:`)
        .finalized()
    )
    .chain(() => free().log(msg(name, "after")))
}
