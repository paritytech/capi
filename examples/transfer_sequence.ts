import { alice, bob, charlie, dave, Rune, RunicArgs, Sr25519, ValueRune } from "capi"
import { Balances, System } from "westend_dev/mod.ts"

await aliceFree()
  .log("Alice balance after transfers")
  .chain(() =>
    Object
      .entries({ bob, charlie, dave })
      .reduce<ValueRune<any, any>>((acc, args) =>
        acc
          .chain(() => beforeThenTxThenAfter(...args))
          .into(ValueRune), Rune.constant(undefined))
  )
  .chain(() => aliceFree().log("Alice balance after transfers"))
  .run()

function aliceFree() {
  return System.Account.entry([alice.publicKey]).access("data", "free")
}

function beforeThenTxThenAfter<X>(...args: RunicArgs<X, [name: string, pair: Sr25519]>) {
  const [name, pair] = RunicArgs.resolve(args)
  const dest = pair.access("address")
  const accountKey = Rune.tuple([pair.access("publicKey")])
  const tx = Balances
    .transfer({ dest, value: 1000123n })
    .signed({ sender: alice })
    .sent()
    .logStatus(Rune.str`transfer to ${name}:`)
    .finalized()
  const free = () => System.Account.entry(accountKey).access("data", "free")
  return free()
    .log(Rune.str`${name} balance before transfer:`)
    .chain(() => tx)
    .chain(() => free().log(Rune.str`${name} balance after transfer:`))
}
