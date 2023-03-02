import { alice, bob, charlie, MultiAddress, Rune } from "capi"
import { MultisigRune } from "capi/patterns/multisig/mod.ts"
import { Balances, chain, Proxy, System } from "polkadot_dev/mod.ts"
import { filterPureCreatedEvents } from "../patterns/proxy/mod.ts"

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
  .signed({ sender: alice })
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
  .signed({ sender: alice })
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
  .signed({ sender: bob })
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
    dest: stashAddress.map(MultiAddress.Id),
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus("Fund Stash:")
  .finalized()

await Rune
  .chain(() => fundMultisig)
  .chain(() => aliceRatify)
  .chain(() => stashAddress)
  .chain(() => fundStash)
  .chain(() => System.Account.entry(Rune.tuple([stashAddress])).dbg("Stash Balance:"))
  .run()
