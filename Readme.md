# Capi

<h4>
  <a href="">Guide</a> &nbsp;·&nbsp;
  <a href="">API Reference</a> &nbsp;·&nbsp;
  <a href="">Support</a> &nbsp;·&nbsp;
  <a href="">Roadmap</a> &nbsp;·&nbsp;
  <a href="">Contributing</a>
</h4>

Capi (Chain API) is a TypeScript toolkit for crafting interactions with Substrate-based chains.

It offers low-level utilities and a high-level functional effect system to abstract over a range of use cases. Using Capi's standard library of effects, you can easily and intuitively interact with any Substrate-based chain while also following best practices and achieving optimal performance.

⚠️ Capi is a work in progress. It is fraught with edge cases and `TODO` comments. If joining the Capi / Apps Framework team interests you, please reach out to<!--INSERT EMAIL ADDR HERE-->.

## Quick Start

> For a complete introduction, please refer to [the official Capi documentation](#).

### Setup

If you're using [Deno](https://deno.land/), simply import via the `denoland/x` specifier.

```ts
import * as $ from "https://deno.land/x/capi/mod.ts";
```

> Note: you may want to pin the version in your import specifier (`https://deno.land/x/capi@x.x.x/mod.ts`).

If you're using [Node](https://nodejs.org/), install as follows.

```
npm install capi
```

Then import as follows.

```ts
import * as C from "capi";
```

### Get a Reference to a Chain

Before we do anything, we must first attain a reference to a given chain. In the following example, we create a reference to the Polkadot relay chain via `C.POLKADOT`, a Capi-exposed constant, which is an array of known RPC proxy URLs. This array of URLs serves as a "beacon."

```ts
const $chain = C.chain(C.POLKADOT);
```

### Read a Balance

```ts
// 1. Which pallet?
const $pallet = C.pallet($chain, "System");

// 2. Which item?
const $accounts = C.map($pallet, "Account");

// 3. Which account (the key) within the map?
const $accountId = C.ss58(MY_ADDR).toAccountId32();

// 4. A representation of the data we wish to read.
const entry = C.entry($accounts, $accountId);

// 6. Execute the read.
const result = await C.read(entry).run();
```

The signature `result` is a union of `Read<unknown>` and all possible error types. We can utilize an `instanceof` check to narrow the `result` before accessing the read value.

```ts
if (result instanceof Error) {
  throw result;
}
result.value;
```

### Transfer Some Dot

```ts
// 1. Which pallet?
const $pallet = C.pallet($chain, "Balances");

// 2. Which callable?
const $Transfer = C.txFactory($pallet, "transfer");

// 3. Where to send the funds?
const $dest = C.ss58(ALICE_ADDR).toMultiAddress();

// 4. Utilize the factory
const $transfer = $Transfer($dest, 42);

// 5. In the case of `Balances::transfer`, we must perform signing.
//    The signing process will vary depending on your environment, wallet, misc.
//    For now we'll assume that a valid secret seed is in scope, defined as `seed`.
const sign = Sign(C.pair.fromSeed(seed));
const $transferSigned = C.signTx(sign, $transfer);

const result = await $transferSigned.run();
```

### Derived Queries / Composing Effects

Let's read the heads of Polkadot's parachains. This requires that we first obtain a list of parachain IDs, and then use these IDs to read their heads.

```ts
// 1. Which pallet?
const $pallet = C.pallet($chain, "Paras");

// 2. Get list of parachain IDs.
const $parachainIds = C.entry($pallet, "Parachains");

// 3. Get a reference to the heads map.
const $parachainHeads = C.map($pallet, "Heads");

// 3. Create an effect for resolving each parachain head.
const $parachainHeads = C.map($parachainIds, (id) => {
  return C.entry($parachainHeads, id);
});

// 6. Execute the read.
const result = await C.read($parachainHeads).run();
```

## Testing

We have yet to publish Capi to [deno.land/x](https://deno.land/x) nor [NPM](https://www.npmjs.com/). For now, clone [`paritytech/capi`](https://github.com/paritytech/capi).

> In the future, Gitpod and dev containers will simplify spinning up a Capi development environments. The [Dockerfile](./Dockerfile), [Gitpod configuration](./.gitpod.yml) and [Dev Containers / Codespaces configuration](./.devcontainer/devcontainer.json) are in need some finessing.

Make sure you have the following installed on your machine (and please submit issues if errors crop up).

### System Requirements

- [Rustup](https://www.rust-lang.org/tools/install) and the wasm32-unknown-unknown target
- [Deno](https://deno.land/manual@v1.19.3/getting_started/installation)
- [Docker](https://docs.docker.com/get-docker/)
- [NodeJS](https://nodejs.org/) (only necessary if you're going to run [the build_npm task](./_/tasks/build_npm.ts))
- [Wasm Bindgen](https://rustwasm.github.io/wasm-bindgen/reference/cli.html)
- [Binaryen](https://github.com/WebAssembly/binaryen)

### Bootstrapping

After cloning the repository, CD into it and execute the following.

```sh
deno task bootstrap
```

### Running an Example

After running the bootstrap script, you should be able to run any of the examples.

```sh
deno task example:balances
```

## Code Structure

You may have noticed that the Capi repository looks somewhat different from a traditional TypeScript repository. This is because Capi is developed Deno-first. [Deno](https://deno.land/) is a TypeScript runtime and toolkit written in Rust. Unlike NodeJS, Deno emphasizes web standards and exposes a performant and type-safe standard library. Deno-first TypeScript can be easily packaged for consumption in NodeJS, Browsers, CloudFlare Workers and other environments. Some things to note:

### No `src` nor Distinct `package/*`

We no longer need to think about the separation of code for the sake of packaging. We can think about separation of code in terms of what best suits our development needs.

For example, exports of [`util/types.ts`](./util/types.ts) can be imported directly into any other TypeScript file, without specifying the dependency in a package manifest. We are free to use (for example) `U2I`, the union to intersection utility, in out-of-band processes, the effect system or even GitHub workflow scripts. From anywhere in the repository, we can import and use any code with configuration overhead.

When it comes time to [build our code](./tasks/build_npm_pkg.ts) for NPM distribution, [DNT](https://github.com/denoland/dnt) takes care of transforming our dependency graph into something that NodeJS and web browsers will understand.

### Import Mapping

In the Capi repository (and all Deno-first repositories) there is no package manifest. We do not specify imports in some central file. While we could certainly create a `deps.ts`/`barrel.ts`/`prelude.ts` at the root and re-export dependencies, that would not be Deno-idiomatic. Instead, we define an [import map (`import_map.json`)](./import_map.json) ([import maps are a web standard](https://wicg.github.io/import-maps/)), which maps leading text of import specifiers. In our case, we add mappings to enable root-relative references. For instance:

Let's say we're inside `frame_metadata/Metadata.ts`, and we want to import `hexToU8a` from `util/mod.ts`.

**Instead of writing this**...

```ts
import { hexToU8a } from "../util/mod.ts";
```

... **we write this**:

```ts
import { Resource } from "/util/mod.ts";
```

Now, if we ever move our `Metadata.ts` file elsewhere, its import of `hexToU8a` remain valid.
