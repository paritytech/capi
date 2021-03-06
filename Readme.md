# Capi

Capi is a WIP TypeScript toolkit for crafting interactions with Substrate-based chains.

Capi consists of [FRAME](https://docs.substrate.io/v3/runtime/frame/)-oriented utilities and (soon) [a high-level functional effect system](_docs/Effects.md) which facilitate multistep, multichain interactions without compromising on performance or safety.

<!--
<h4>
  <a href="">Guide</a> &nbsp;·&nbsp;
  <a href="">API Reference</a> &nbsp;·&nbsp;
  <a href="">Support</a> &nbsp;·&nbsp;
  <a href="">Roadmap</a> &nbsp;·&nbsp;
  <a href="">Contributing</a>
</h4>
-->

## ⚠ This Is a Work in Progress

️Please share feedback or even join us in Capi's development; issues and PRs are very welcome!

### In Good Shape

- [x] RPC `call` and `subscribe` utils
- [x] Metadata types and SCALE codecs
- [x] Metadata-based codec derivation
- [x] Storage key encoding and (when transparent) decoding
- [x] Storage value decoding
- [x] Creating and decoding extrinsics
- [x] RPC Client hooks / error handing

### TODO

- [ ] Take a look at [this repo's issues](https://github.com/paritytech/capi/issues)

### Setup

If you're using [Deno](https://deno.land/), import via the `denoland/x` specifier.

```ts
import * as C from "https://deno.land/x/capi/mod.ts";
```

> Note: you may want to pin the version in your import specifier (`https://deno.land/x/capi@x.x.x/mod.ts`).

If you're using [Node](https://nodejs.org/), install Capi from NPM.

```sh
npm install capi
```

Then import as follows.

```ts
import * as C from "capi";
```

## Configs

### Introduction

Before interacting with a given chain, we must have a means of finding nodes of that chain (a config).

A Polkadot-specific config is accessible from `capi/known`.

```ts
// Deno
import { polkadot } from "https://deno.land/x/capi/known/mod.ts";
// Node
import { polkadot } from "capi/known";
```

The static type of any config can describe accessible RPC server methods and FRAME metadata. This enables a narrowly-typed experience to flow through all usage of Capi.

```ts
const polkadot = C.chain(polkadot);
```

Better yet, let's import `polkadot` directly from `capi/known`.

```ts
import { polkadot } from "capi/known";
```

### Testing

During development, connecting to a live network can slow down the feedback loop. It also may be infeasible, in the case that you are without an internet connection. In these situations, you can utilize Capi's test utilities.

```diff
+ const node = await C.test.node();
+
- const chain = C.chain(myConfig);
+ const chain = C.test.chain(node);

//

+ node.close()
```

Here, we've spun up a tiny, temporary chain. You can even access accounts (and their corresponding signers).

```ts
const { alice } = chain.address;
```

For convenience, we'll be utilizing the test chain and addresses.

### Read a Balance

```ts
const alicePublicKey = chain.address.alice.asPublicKeyBytes();

const value = await chain
  .pallet("System")
  .entry("Account", alicePublicKey)
  .read();
```

#### Read at Specific Block Hash

```ts
const block = chain.block(BLOCK_HASH);

// ...

const value = await chain
  .pallet("System")
  .entry("Account", alicePublicKey)
  .read(block);
```

### Note About Typings

#### Signatures

The signature `value` is a union of `Read<unknown>` and all possible error types.

```ts
assertTypeEquals<
  typeof value,
  C.Read<unknown> | C.WsRpcError | C.StorageEntryDneError | C.StorageValueDecodeError
>();
```

#### Narrow Error Handling

We can utilize an `instanceof` check to narrow the `result` before accessing the read value.

```ts
if (result instanceof Error) {
  // Handle narrow error types here
} else {
  // Handle `C.Read<unknown>` here
}
```

### Transfer Some Dot

```ts
import * as C from "../mod.ts";

// ...

const { alice, bob } = chain.address;

const result = chain
  .pallet("Balances")
  .extrinsic("transfer")
  .call({
    dest: alice.asPublicKeyBytes(),
    value: 12345n,
  })
  .signed(bob, bob.sign)
  .send();

for await (const event of result) {
  console.log({ event });
}
```

> Note: it is up to the developer to supply `sign` with a signing function, which will vary depending on your environment, wallet, misc.

## Contributing

> In the future, Gitpod and dev containers will simplify spinning up a Capi development environments. The [Dockerfile](./Dockerfile), [Gitpod configuration](./.gitpod.yml) and [Dev Containers / Codespaces configuration](./.devcontainer/devcontainer.json) are in need some finessing.

Make sure you have the following installed on your machine (and please submit issues if errors crop up).

### System Requirements

- [Rustup](https://www.rust-lang.org/tools/install) and the wasm32-unknown-unknown target
- [Deno](https://deno.land/manual@v1.19.3/getting_started/installation)
- [Docker](https://docs.docker.com/get-docker/)
- [NodeJS](https://nodejs.org/) (only necessary if you're going to run [the build_npm task](./_/tasks/build_npm.ts))
- [Wasm Bindgen](https://rustwasm.github.io/wasm-bindgen/reference/cli.html)
- [Binaryen](https://github.com/WebAssembly/binaryen)

### Running an Example

```sh
deno task run <path-to-example>
```

### Building Wasm & Its Corresponding JS Bindings

```sh
deno task build:wasm
```

### Utilizing the Package in a NodeJS Project

Build the NPM package and link it locally.

```sh
deno task dnt && cd target/npm && npm link
```

Then link to Capi from your NodeJS project.

```ts
npm link capi
```

## Code Structure

You may have noticed that the Capi repository looks somewhat different from a traditional TypeScript repository. This is because Capi is developed Deno-first. [Deno](https://deno.land/) is a TypeScript runtime and toolkit written in Rust. Unlike NodeJS, Deno emphasizes web standards and exposes a performant and type-safe standard library. Deno-first TypeScript can be easily packaged for consumption in NodeJS, Browsers, CloudFlare Workers and other environments. Some things to note:

### No `src` nor Distinct `package/*`

We no longer need to think about the separation of code for the sake of packaging. We can think about separation of code in terms of what best suits our development needs.

For example, exports of [`util/types.ts`](./util/types.ts) can be imported directly into any other TypeScript file, without specifying the dependency in a package manifest. We are free to use (for example) `U2I`, the union to intersection utility, in out-of-band processes, the effect system or even GitHub workflow scripts. From anywhere in the repository, we can import and use any code with configuration overhead.

When it comes time to [build our code](./tasks/dnt.ts) for NPM distribution, [DNT](https://github.com/denoland/dnt) takes care of transforming our dependency graph into something that NodeJS and web browsers will understand.
