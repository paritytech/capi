/**
 * @title Multisig Administration of Pure Proxy Stash
 * @stability unstable
 * @description Administrate a stash account (pure proxy) through a multisig with
 * three signatories.
 * @test_skip
 */

import { MultiAddress, PolkadotDev } from "@capi/polkadot-dev"
import { assert } from "asserts"
import { createDevUsers } from "capi"
import { MultisigRune } from "capi/patterns/multisig/mod.ts"
import { filterPureCreatedEvents } from "capi/patterns/proxy/mod.ts"
import { signature } from "capi/patterns/signature/polkadot.ts"

const { alexa, billy, carol } = await createDevUsers()

/// Initialize the `MultisigRune` with Alexa, Billy and Carol. Set the passing threshold to 2.
const multisig = MultisigRune.from(PolkadotDev, {
  signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
  threshold: 2,
})

/// Send funds to the multisig (existential deposit).
await PolkadotDev.Balances
  .transfer({
    value: 20_000_000_000_000n,
    dest: multisig.address,
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Existential deposit:")
  .finalized()
  .run()

/// Describe the call which we wish to dispatch from the multisig account:
/// the creation of the stash / pure proxy, belonging to the multisig account itself.
const call = PolkadotDev.Proxy.createPure({
  proxyType: "Any",
  delay: 0,
  index: 0,
})

/// Propose the stash creation call.
await multisig
  .ratify(alexa.address, call)
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Proposal:")
  .finalized()
  .run()

/// Approve the stash creation call and extract the pure creation event, which should
/// contain its account id.
const stashAccountId = await multisig
  .ratify(billy.address, call)
  .signed(signature({ sender: billy }))
  .sent()
  .dbgStatus("Final approval:")
  .finalizedEvents()
  .pipe(filterPureCreatedEvents)
  .access(0, "pure")
  .run()

/// Send funds to the stash (existential deposit).
await PolkadotDev.Balances
  .transfer({
    value: 20_000_000_000_000n,
    dest: MultiAddress.Id(stashAccountId),
  })
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Fund Stash:")
  .finalized()
  .run()

/// Ensure that the funds arrived successfully.
const stashFree = await PolkadotDev.System.Account
  .value(stashAccountId)
  .unhandle(undefined)
  .access("data", "free")
  .run()

/// The stash's free should be greater than zero.
console.log("Stash free:", stashFree)
assert(stashFree > 0)
