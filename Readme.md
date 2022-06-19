# Capi

Capi is a WIP TypeScript toolkit for crafting interactions with Substrate-based chains.

Capi consists of [FRAME](https://docs.substrate.io/v3/runtime/frame/)-oriented utilities and [a high-level functional effect system](_docs/Effects.md) which facilitate multistep, multichain interactions without compromising on performance or safety.

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

#### In Good Shape

- [x] RPC `call` and `subscribe` utils
- [x] Metadata types and SCALE codecs
- [x] Metadata-based codec derivation
- [x] Storage key encoding and (when transparent) decoding
- [x] Storage value decoding
- [x] Creating and decoding extrinsics

#### Needs Love

- [ ] High-level "Effect" System
- [ ] Std lib of effects

#### TODO

- [ ] RPC Client Error Handing
- [ ] Get async iterable from RPC subscription
- [ ] ... TODO, the remainder of this TODO section (we primarily use [this repo's issues](https://github.com/paritytech/capi/issues))

### Setup

> Note: we have yet to publish a beta of Capi. Expect the first publish to occur in the next few days (written on June 10th, 2022).

If you're using [Deno](https://deno.land/), import via the `denoland/x` specifier.

```ts
import * as C from "https://deno.land/x/capi/mod.ts";
```

> Note: you may want to pin the version in your import specifier (`https://deno.land/x/capi@x.x.x/mod.ts`).

If you're using [Node](https://nodejs.org/), install Capi from NPM.

```
npm install capi
```

Then import as follows.

```ts
import * as C from "capi";
```

### WIP DX vs. North Star

For now, we will manually instantiate an RPC client (in this case, with a proxy WebSocket URL).

```ts
const client = C.wsRpcClient(C.POLKADOT_PROXY_WS_URL);

// Use the client here

await client.close();
```

Our north star is a version of Capi which manages the connection lifecycle on your behalf.

```ts
const chain = C.chain(C.POLKADOT_PROXY_WS_URL);
```

Additionally, our north star is fluent. Instead of writing a pallet reference as follows.

```ts
const systemPallet = C.pallet(C.chain(C.POLKADOT_CHAIN_SPEC), "System");
```

One will write it like so:

```ts
const systemPallet = C.chain(C.POLKADOT_CHAIN_SPEC).pallet("System");
```

The following examples detail the north star experience, not the in-development experience. For examples of the current API's usage, look in the `examples` folder (all of which can be run with `deno task example:<example-name>`).

### Read a Balance

```ts
// 1. Which chain?
const chain = C.chain(C.POLKADOT_CHAIN_SPEC);

// 2. Which key within the balances storage map?
const accountId = chain.ss58(MY_ADDR).toAccountId32();

// 3. Which value within the storage map?
const value = await chain
  .pallet("System")
  .storageMap("Account")
  .get(accountId)
  .read(); // ... as opposed to `subscribe`
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

#### Assertion of Type

The on-chain world is evolving rapidly. This creates uncertainty regarding types. To mitigate this uncertainty, you can (optionally) utilize Capi's virtual type system to assert a given shape.

```diff
const value = await chain
  .pallet("System")
  .storageMap("Account")
  .get(accountId)
+ .as(C.$.sizedUint8Array(32))
  .read();
```

There are three main reason to utilize `as`:

1. We can confirm that a given interaction's type-level expectations align with the metadata before dispatch.
2. Legibility: the `as` call makes obvious the value encapsulated by the `Read`.
3. We can produce a narrow signature.

```diff
- C.Read<unknown> | C.WsRpcError | C.StorageEntryDneError | C.StorageValueDecodeError
+ C.Read<Uint8Array> | C.WsRpcError | C.StorageEntryDneError | C.StorageValueDecodeError
```

### Transfer Some Dot

```ts
// 1. Which chain?
const chain = C.chain(C.POLKADOT_CHAIN_SPEC);

// 2. Where to send the funds?
const dest = chain.ss58(ALICE_ADDR).toMultiAddress();

// 3. Craft and submit the transaction.
await C
  .pallet("Balances")
  .txFactory("transfer")
  .call(dest, 42);
  .sign(signingFn)
  .submit()
```

> Note: it is up to the developer to supply `sign` with a signing function, which will vary depending on your environment, wallet, misc.

### Derived Queries / Composing Effects

Let's read the heads of Polkadot's parachains. This requires that we first obtain a list of parachain IDs, and then use those IDs to read their heads.

```ts
// 1. Which pallet?
const pallet = C.chain(C.POLKADOT_CHAIN_SPEC).pallet("Paras");

// 2. What is the first step in the derived query? In this case, reading the heads.
const parachainHeads = pallet.storageMap("Heads");

// 3. Map from the to-be-evaluated result.
const parachainIds = await pallet
  .entry("Parachains")
  .as(C.$.array($.u32))
  .map(parachainHeads.get)
  .read();
```

## Testing

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
