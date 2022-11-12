# Quick Start

## Setup

If you're using [Deno](https://deno.land/), import Capi via its [`denoland/x`](https://deno.land/x) URI.

```ts
import * as C from "https://deno.land/x/capi/mod.ts"
```

> Note: you may want to pin the version in the import specifier (`"https://deno.land/x/capi@x.x.x/mod.ts"`).

If you're using [Node](https://nodejs.org/), install Capi from [NPM](https://www.npmjs.com/).

```sh
npm install capi
```

Then import as follows.

```ts
import * as C from "capi"
```

> The `capi` NPM package contains both ESM & CJS formats, alongside corresponding type definitions.

This documentation will prefer the Node-style import for the sake of brevity, although Capi itself is a Deno-first toolkit.

## Static vs. Dynamic

**If we know the exact chain(s) with which we're going to interact, the "static" approach is preferable**. This approach offers minimal and type-safe bindings to specific chains. The benefits of this are far-reaching: compile-time validation, inference and autocompletion, symbol-bound ([TSDoc](https://tsdoc.org/)) comments, precompiled codecs and more. Given these DX gains, the static approach gets the majority of attention throughout this documentation. If, however, you do not have development-time knowledge of the target chain, [the "dynamic" approach](./Dynamic_Targets.md) is for you.

## Generate Bindings

We use Capi's codegen CLI to generate bindings to a given chain.

```sh
deno run -A -r https://deno.land/x/capi/codegen.ts \
  --src="wss://rpc.polkadot.io" \
  --out="polkadot"
```

> Note: the `src` string can be a comma-separated list of proxy node URLs or even a relative path to chain spec on disk.
>
> Note: we can run this in CI for ongoing validation that our usage aligns with the latest runtime.

## Read the Latest Block

```ts
import * as C from "capi"
import { block } from "./polkadot/core.ts"

const block = await C.run(block.latest)
```

## Reading From Storage

Let's read from on-chain storage.

```ts
import * as C from "capi"
import { system } from "./polkadot/frame.ts"

// bind to the last inserted key
const key = system.account.keys.first

// bind to the corresponding value
const value = C.run(system.account.get(key))
```

## Transferring Some Funds

In the following example, we create and sign an extrinsic that calls the Balance pallet's transfer method.

```ts
import * as C from "capi"
import { balances } from "./polkadot/frame.ts"

declare const aliceSigner: C.Signer

const tx = balances.transfer({
  value: 12345n,
  dest: C.MultiAddress.fromPublic(BOB_PUBLIC_KEY),
})
  .signed(aliceSigner)
  .sent
  .finalized

const result = await C.run(tx)
```

### Observe Transfer Events

Let's modify the code above so that we can observe corresponding events as they are emitted.

```diff
const tx = balances.transfer({
  value: 12345n,
  dest: C.MultiAddress.fromPublic(BOB_PUBLIC_KEY),
})
  .signed(aliceSigner)
- .sent
+ .watched((stop) => {
+   return (message) => {
+     // use `message`
+   }
+ });
- .finalized;
```

---

At this point, we've generated chain-specific bindings, read the latest block, read from some on-chain storage and created, submitted and watched a transfer extrinsic. Now let's cover the API step by step, starting with notes on [principles](./Principles.md), including context on design decisions and long-term goals.
