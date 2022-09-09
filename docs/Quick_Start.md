# Quick Start

## Setup

If you're using [Deno](https://deno.land/), import Capi via the [`denoland/x`](https://deno.land/x) specifier.

```ts
import * as C from "https://deno.land/x/capi/mod.ts";
```

> Note: you may want to pin the version in your import specifier (https://deno.land/x/capi@x.x.x/mod.ts).

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

## A Basic Example

Let's read some data from the on-chain world.

```ts
import polkadot from "https://deno.land/x/capi-polkadot@0.1.0/mod.ts";
import * as C from "https://deno.land/x/capi@0.1.0/mod.ts";

// Get a reference to the accounts map
const accounts = polkadot.map("System", "Account");

// Get a reference to the last inserted key of the map
const key = accounts.keys().first();

// Get a reference to the corresponding value
const value = accounts.get(lastInserted);

// Finally, run `value` (a lazy description, aka. an "Effect")
console.log(value.run());
```
