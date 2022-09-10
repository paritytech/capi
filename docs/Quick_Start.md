# Quick Start

## Setup

If you're using [Deno](https://deno.land/), import Capi via its [`denoland/x`](https://deno.land/x) URI.

```ts
import * as C from "https://deno.land/x/capi/mod.ts";
```

> Note: you may want to pin the version in the import specifier (https://deno.land/x/capi@x.x.x/mod.ts).

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

To begin interacting with any chain, we must first have a [config](Configs.md). The attaining of a config will differ depending on whether we know the exact chain(s) with which we're going to interact.

### Static

The static path is always preferable if you know the chains with which your program will interact; static configs can be encoded with chain-specific type information such that invalid interaction produces compile-time errors.

The proprietors of chains may maintain chain-specific configs (among other utilities). One such example is that of Polkadot.

```ts
import { config as polkadot } from "@capi/polkadot";
```

This config encapsulates all of the discovery values (RPC URLs), flight-critical constants (Ss58 prefix, misc.) and static typing of the Polkadot relay chain.

In some cases––if there is no standard config––one can [generate a custom config](./Configs.md#custom-configs).

### Dynamic

Not all configs can be known at the time of development.

Let's say we're building a block explorer website, into which the visitor can specify a Substrate chain RPC node URL. In this case, we would need to construct the config at runtime.

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

A static config will enable a smoother experience, with auto-completion (depending on your IDE) and type-checking. For example, let's index into a block's extrinsics.

```ts
block.extrinsics[0]?.methodName;
```

The static config will treat `methodName` as `ExtrinsicMethodName | undefined`, where `ExtrinsicMethodName` is a union of all method name literal. The dynamic config will treat `methodName` as a widened `string`.

## Using A Config

Once we have a config, we can use it alongside Capi's bindings to the on-chain world.

Let's read some data from the on-chain world.

```ts
import { config as polkadot } from "https://deno.land/x/capi-polkadot@0.1.0/mod.ts";
import * as C from "https://deno.land/x/capi@0.1.0/mod.ts";

// Get a reference to the accounts map
const accounts = C.map(polkadot, "System", "Account");

// Get a reference to the last inserted key of the map
const key = accounts.keys().first();

// Read the corresponding value
const value = await accounts.get(lastInserted).read();
```

## Onward To Adventure

At this point, we've brought Capi dependencies into scope, learned about Capi configs and read from some on-chain storage. Now let's cover the API step by step, starting with notes on [general philosophy](Philosophy.md), including context on design decisions and long-term goals.
