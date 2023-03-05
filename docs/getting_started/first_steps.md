# First Steps

Let's transact some dot between test users on a Polkadot test network. Let's also read out the balance change to confirm that our transaction was finalized and successful.

First let's bring in the imports of which we'll be making use.

```ts
import { alice, bob, ValueRune } from "capi"
import { Balances, System } from "http://localhost:4646/frame/dev/polkadot/@latest/mod.ts"
```

- `alice` and `bob` are our test users, between whom the transaction will take place
- `ValueRune` isn't something to scrutinize quite yet: we'll discuss this later
- `Balances` and `System` are namespaces containing bindings to all of their respective pallets' storage, calls and constants

We use the `Balances.transfer` factory to create the submittable call data.

```ts
Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
```

Next, we sign the transaction with `alice`.

```diff
Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
+ .signed({ sender: alice })
```

> Note: If we want to supply another sender/signer (such as that of a wallet extension), we can do this with ease. More [info on wallet compatibility here](/docs/integration/wallets.md).

Now we specify what we want to occur with the signed extrinsic. It's worth pointing out the declarative naming; generally speaking, we aim for the API to describe what we want to occur (for the signed extrinsic to be `sent`).

```diff
Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
  .signed({ sender: alice })
+ .sent()
```

Next, we specify what data we want to resolve from this extrinsic's submission. In this case, we'll resolve the block in which the extrinsic was finalized.

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

Before finally triggering execution, let's add a continuation: the retrieval of Bob's balance. This lets us confirm that the transaction was successful.

```diff
Balances
  .transfer({
    value: 12345n,
    dest: bob.address,
  })
  .signed({ sender: alice })
  .sent()
  .finalized()
+ .into(ValueRune)
+ .chain(() => System.Account.value(bob.publicKey).dbg())
```

Great! We've built up a description of the desired execution. Let's run it. Altogether, our example looks as follows.

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
