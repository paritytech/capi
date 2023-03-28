import { Rune, Sr25519 } from "capi"
import { Balances, createUsers, System } from "westend_dev/mod.js"
import { signature } from "../patterns/signature/polkadot.ts"

const { alexa, billy, carol } = await createUsers()

const balances = Rune.rec({
  alice: balance(alexa),
  bob: balance(billy),
  charlie: balance(carol),
})

console.log("Initial balances", await balances.run())
await transfer("bob", billy).run()
console.log("Balances after Bob transfer", await balances.run())
await transfer("carol", carol).run()
console.log("Final balances", await balances.run())

function balance(user: Sr25519) {
  return System.Account.value(user.publicKey).unhandle(undefined).access("data", "free")
}

function transfer(name: string, user: Sr25519) {
  return Balances
    .transfer({
      dest: user.address,
      value: 1000123n,
    })
    .signed(signature({ sender: alexa }))
    .sent()
    .dbgStatus(`Transfer to ${name}:`)
    .finalized()
}
