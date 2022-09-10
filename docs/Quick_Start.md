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

> `capi`'s NPM package contains both ESM & CJS formats, alongside corresponding type definitions.

This documentation will prefer the Node-style import for the sake of brevity, although Capi itself is a Deno-first toolkit.

## Configs

To begin interacting with any chain, we must first have a [config](Configs.md). The process of attaining a config differs depending on whether we know the exact chain(s) with which we're going to interact.

### Static

We use "static" configs when we know the chain(s) with which our program interacts; **static configs are encoded with chain-specific type information so that invalid usage results in compile-time errors**.

3rd parties such as chain proprietors and communities may provide configs (among other [Effects](Effects.md) and utilities) external to Capi. One such example is that of Polkadot.

```ts
import { config as polkadot } from "@capi/polkadot";
```

> **Deno** import specifier: `https://deno.land/x/capi-polkadot/mod.ts`<br />
> **Node** package name: `@capi/polkadot`

This `config` encapsulates discovery values (RPC URLs and chain specs), flight-critical constants (Ss58 prefix, misc.) and static typing of the Polkadot relay chain.

If there is no standard, community-provided config, one can [generate a config](./Configs.md#custom-configs).

### Dynamic

Not all configs can be known at the time of development.

Let's say we're building a block explorer website, on which the visitor can specify a Substrate chain RPC node URL. In this case, we would need to construct the config at runtime.

```ts
import * as C from "capi";

const url = prompt("Please enter the URL of a Substrate chain RPC node.");
const prefix = prompt("Please enter the chain prefix.");
const config = C.config({ url, prefix });
```

While this works, the lack of static typing is a noteworthy drawback.

```ts
const block = await C.block(config).read();
```

A static config will enable a smoother experience, with type-checking and––depending on your IDE––auto-completion. For example, let's index into a block's extrinsics.

```ts
block.extrinsics[0]?.methodName;
```

When using a static config, `methodName` will be typed as `ExtrinsicMethodName | undefined`, where `ExtrinsicMethodName` is a union of all method name literals. The dynamic equivalent will result in `methodName` typed as a widened `string`.

## Using A Config

Now that we've covered configs, let's use a config (that of Polkadot) to read from some on-chain storage.

<!-- dprint-ignore -->

```ts
import * as C from "capi";
import { config as polkadot } from "@capi/polkadot";

// Get a reference to the accounts map
const accounts = C.map(polkadot, "System", "Account");

// Get a reference to the last inserted key of the map
const key = accounts.keys().first();

// Read the corresponding value
const value = await accounts.get(key).read();
```

## Onward To Adventure

At this point, we've brought Capi dependencies into scope, learned about Capi configs and read from some on-chain storage. Now let's cover the API step by step, starting with notes on [general philosophy](Philosophy.md), including context on design decisions and long-term goals.
