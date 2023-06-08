# Multisig Patterns

Multisig patterns encapsulate common use cases for [Polkadot Multi-Signature Accounts](https://wiki.polkadot.network/docs/learn-account-multisig).

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

## VirtualMultisigRune

`VirtualMultisigRune` is advanced variant of `MultisigRune` that represents the following diagram:

![Multisig User Flow](https://user-images.githubusercontent.com/7630720/216309354-ef39ed1b-230b-40d3-9e78-749828650e90.png)

Where the multisig is composed of `N` signatories and each signatory is a pure proxy that can be controlled by one or more accounts (in this case just 1). The multisig owns a stash which is also a pure proxy which can be used to send and receive funds from.

Users are expected to `Proxy.proxy` a call to the multisig which sends another `Proxy.proxy` call to the stash to complete a transfer. This logic is simplified by `VirtualMultisigRune`, which handles the creation of the pure proxies and assigning their ownership via `VirtualMultisigRune.deployment`.

Users can then continue to use `VirtualMultisigRune` as they would with `MultisigRune` but with all the proxy logic done under the hood.

See `examples/multisig/virtual.eg.ts` for usages.
