# Quick Start

## Setup

If you're using [Deno](https://deno.land/), import Capi via its [`denoland/x`](https://deno.land/x) URI.

```ts
import * as C from "https://deno.land/x/capi/mod.ts";
```

> Note: you may want to pin the version in the import specifier (`"https://deno.land/x/capi@x.x.x/mod.ts"`).

If you're using [Node](https://nodejs.org/), install Capi from [NPM](https://www.npmjs.com/).

```sh
npm install capi
```

Then import as follows.

```ts
import * as C from "capi";
```

> The `capi` NPM package contains both ESM & CJS formats, alongside corresponding type definitions.

This documentation will prefer the Node-style import for the sake of brevity, although Capi itself is a Deno-first toolkit.

## Static vs. Dynamic

**If we know the exact chain(s) with which we're going to interact, the "static" approach is preferable**. This approach offers minimal and type-safe bindings to specific chains. The benefits of this are far-reaching: compile-time validation, inference/autocomplete, tsdoc comments, precompiled codecs and more. The static approach gets the majority of attention throughout this documentation. If you, however, do not have development-time knowledge of the target chain, [the "dynamic" approach](./Dynamic_Targets.md) is for you.

## Generate Chain-specific Bindings

We use Capi's code generator to output minimal bindings based on the latest runtime of a given chain.

```sh
deno run -A -r https://deno.land/x/capi/codegen.ts \
  --out="polkadot.ts" \
  --src="wss://rpc.polkadot.io"
```

> Note: we can run this in CI for ongoing validation that our usage aligns with the latest runtime.

## Reading the Latest Block

```ts
import * as polkadot from "./polkadot.ts";

const block = await polkadot.block().read();
```

## Reading From Storage

Let's read from on-chain storage.

```ts
import * as polkadot from "./polkadot.ts";

// bind to the last inserted key (the `x` prefix distinguishes effects from values)
const xKey = polkadot.system.account.keys().first();

// read the corresponding value
const value = await polkadot.system.account.get(xKey).read();
```

## Transferring Some Funds

In the following example, we create and sign an extrinsic that calls the Balance pallet's transfer method.

```ts
import * as C from "capi";
import * as polkadot from "./polkadot.ts";

declare const aliceSigner: C.Signer;

const xTransfer = polkadot.balances.transfer({
  value: 12345n,
  dest: C.MultiAddress.fromPublic(BOB_PUBLIC_KEY),
})
  .immortal()
  .tip(10000)
  .signed(aliceSigner);

const result = await xTransfer.send();
```

### Observe Transfer Events

Let's modify the code above so that we can observe corresponding events as they are emitted.

```diff
- const result = await xTransfer.send();
+ const result = await xTransfer.send((stop) => {
+   return (event) => {
+     // ...
+   };
+ });
```

---

At this point, we've generated chain-specific bindings, read from some on-chain storage and created, submitted and watched a transfer extrinsic. Now let's cover the API step by step, starting with notes on [principles](./Principles.md), including context on design decisions and long-term goals.
