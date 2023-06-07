# Multisig Patterns

Multisig patterns encapsulate common usecases for [Polkadot Multi-Ssignature Accounts](https://wiki.polkadot.network/docs/learn-account-multisig).

## MultisigRune

To create a multisig, use the `MultisigRune.from` method. Note this doesn't create a multisig on-chain -- a multisig is derived from it signatories and threshold.

```ts
import { MultisigRune } from "capi/patterns/multisig/mod.ts"

const { alexa, billy, carol } = await createDevUsers()

const multisig = MultisigRune.from(polkadotDev, {
  signatories: [alexa, billy, carol].map(({ publicKey }) => publicKey),
  threshold: 2,
})
```

To share a MultisigRune with another member of the multisig, you can use `MultisigRune.hex`

```ts
const serializedMultisigRune = await multisig.hex.run()
```

Which can then be reconstructed with the `MultisigRune.fromHex` function.

```ts
MultisigRune.fromHex(polkadotDev, serializedMultisigRune)
```

To create or approve a proposal use `multisig.ratify`. Under the hood this will call `Multisig.asMulti` extrinsic. If you want to use `Multisig.approveAsMulti`, you must pass in the `nonExecuting` boolean parameter to `ratify`.

```ts
await multisig
  .ratify(alexa.address, call)
  .signed(signature({ sender: alexa }))
  .sent()
  .dbgStatus("Proposal:")
  .finalized()
  .run()
```
