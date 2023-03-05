# First Steps

Let's import `Balances` bindings from the Polkadot dev provider's root `mod.ts`.

```ts
import { Balances } from "http://localhost:4646/frame/dev/polkadot/@latest/mod.ts"
```

Let's also import two test users (between whom the transaction will take place).

```diff
  import { Balances } from "http://localhost:4646/frame/dev/polkadot/@latest/mod.ts"
+ import { alice, bob } from "capi"
```

Next, we define the call data that we'd like to submit. Every pallet namespace contains factories for producing this call data in a type-safe manner.

```ts
Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
```

Next, we sign the transaction with the `ExtrinsicSender`.

```diff
Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
+ .signed({ sender: alice })
```

In this case, the extrinsic sender is `alice`, an instance of `Sr25519`, which implicitly implements `ExtrinsicSender` (has the following fields: `address: MultiAddress; sign: Signer`).

> Note: if we want to sign via a wallet such as Talisman or PolkadotJS extension, we can supply their respective `Signer`s in place of a `sender`. More [info on wallet compatibility here](/docs/integration/wallets.md).

We can now specify what we want to occur with the signed extrinsic (for it to be `sent`).

```diff
Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
  .signed({ sender: alice })
+ .sent()
```

Next, let's specify what data we want resolved from this tx's execution (in this case, we'll resolve the block in which the extrinsic was finalized).

```diff
Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
  .signed({ sender: alice })
  .sent()
+ .finalized()
```

> Note: you can call the `dbgStatus` method on the result of the `sent` call in order to see progress logs from the RPC node.

Finally, we'll call the `run` method to trigger the Rune's execution. One last thing to do: let's retrieve Bob's balance as to confirm that the transaction was successful.

All together, our example looks like so:

```ts
import { alice, bob, ValueRune } from "capi"
import { Balances, System } from "http://localhost:4646/frame/dev/polkadot/@latest/mod.ts"

await Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
  .signed({ sender: alice })
  .sent()
  .dbgStatus()
  .finalized()
  .into(ValueRune)
  .chain(() => System.Account.value(bob.publicKey).dbg())
  .run()
```

Upon running this script, we should see three transaction statuses (`ready`, `inBlock` and `finalized`) followed by Bob's new account info.

```ts
{
  nonce: 0,
  consumers: 0,
  providers: 1,
  sufficients: 0,
  data: {
    free: 10000000000012345n,
//                    ^
//                    victory!
    reserved: 0n,
    miscFrozen: 0n,
    feeFrozen: 0n,
  },
}
```

---

Now that we've done a basic transaction and storage retrieval, let's simplify our setup with import mapping.
