import { Rune } from "capi"
import { MultisigRune } from "capi/patterns/multisig/mod.ts"
import { filterPureCreatedEvents } from "capi/patterns/proxy/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, chain, createUsers, Proxy, System } from "polkadot_dev/mod.js"
import { MultiAddress } from "polkadot_dev/types/sp_runtime/multiaddress.js"

const { alexa, billy, carol } = await createUsers()

const multisig = Rune
  .constant({
    signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
    threshold: 2,
  })
  .into(MultisigRune, chain)

await Balances
  .transfer({
    value: 20_000_000_000_000n,
    dest: multisig.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Fund Multisig:")
  .finalized()
  .run()

const call = Proxy.createPure({
  proxyType: "Any",
  delay: 0,
  index: 0,
})

await multisig
  .ratify({ call, sender: alexa.address })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Alice Ratify:")
  .finalized()
  .run()

const stashAddress = await multisig
  .ratify({ call, sender: billy.address })
  .signed(signature({ sender: billy }))
  .sent()
  .dbgStatus("Bob Ratify:")
  .finalizedEvents()
  .pipe(filterPureCreatedEvents)
  .access(0, "pure")
  .run()

await Balances
  .transfer({
    value: 20_000_000_000_000n,
    dest: MultiAddress.Id(stashAddress),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Fund Stash:")
  .finalized()
  .run()

console.log("Stash balance:", await System.Account.value(stashAddress).run())
