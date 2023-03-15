import { alice, bob, charlie, Rune } from "capi"
import { MultisigRune } from "capi/patterns/multisig/mod.ts"
import { filterPureCreatedEvents } from "capi/patterns/proxy/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"
import { Balances, chain, Proxy, System } from "polkadot_dev/mod.js"
import { MultiAddress } from "polkadot_dev/types/sp_runtime/multiaddress.js"

const multisig = Rune
  .constant({
    signatories: [alice.publicKey, bob.publicKey, charlie.publicKey],
    threshold: 2,
  })
  .into(MultisigRune, chain)

const fundMultisig = Balances
  .transfer({
    value: 20_000_000_000_000n,
    dest: multisig.address,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Fund Multisig:")
  .finalized()

const aliceRatify = multisig
  .ratify({
    call: Proxy.createPure({
      proxyType: "Any",
      delay: 0,
      index: 0,
    }),
    sender: alice.address,
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Alice Ratify:")
  .finalized()

const bobRatify = multisig
  .ratify({
    call: Proxy.createPure({
      proxyType: "Any",
      delay: 0,
      index: 0,
    }),
    sender: bob.address,
  })
  .signed(signature({ sender: bob }))
  .sent()
  .dbgStatus("Bob Ratify:")

const stashAddress = bobRatify
  .finalizedEvents()
  .pipe(filterPureCreatedEvents)
  .map((events) => events[0]!)
  .access("pure")

const fundStash = Balances
  .transfer({
    value: 20_000_000_000_000n,
    dest: MultiAddress.Id(stashAddress),
  })
  .signed(signature({ sender: alice }))
  .sent()
  .dbgStatus("Fund Stash:")
  .finalized()

await Rune
  .chain(() => fundMultisig)
  .chain(() => aliceRatify)
  .chain(() => stashAddress)
  .chain(() => fundStash)
  .chain(() => System.Account.value(stashAddress).dbg("Stash Balance:"))
  .run()
