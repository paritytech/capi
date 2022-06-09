# Capi

Capi is a WIP TypeScript toolkit for crafting interactions with Substrate-based chains.

Capi consists of FRAME-oriented utilities and [a high-level functional effect system](_docs/Effects.md) which facilitate multichain interactions without compromising on performance nor security.

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
- [x] Storage key encoding
- [x] Storage value decoding

#### Needs Love

- [ ] Creating / extracting from extrinsics
- [ ] High-level "Effect" System
- [ ] Std lib of effects

#### TODO

- [ ] RPC Client Error Handing
- [ ] Get async iterable from RPC subscription
- [ ] ... TODO, the remainder of this TODO section (we primarily use [this repo's issues](https://github.com/paritytech/capi/tree/harry-pre_beta_docs))

### Setup

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

### Current DX vs. North Star

For now, we will manually instantiate an `RpcClient` (in this case, with a proxy WebSocket URL).

```ts
const rpc1 = C.wsRpcClient(C.POLKADOT_PROXY_WS_URL);
const rpc2 = C.wsRpcClient(C.POLKADOT_CHAIN_SPEC);

// Use the client here

await rpc.close();
```

Our north star is a version of Capi which manages the connection lifecycle on your behalf.

```ts
const chain1 = C.chain(C.POLKADOT_PROXY_WS_URL);
const chain2 = C.chain(C.POLKADOT_CHAIN_SPEC);
```

Additionally, the API will be fluent.

Instead of writing a pallet reference as follows.

```ts
const systemPallet = C.pallet(
  C.chain(C.POLKADOT_CHAIN_SPEC),
  "System",
);
```

One will write it like so:

```ts
const systemPallet = C
  .chain(C.POLKADOT_CHAIN_SPEC)
  .pallet("System");
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

The signature `value` is a union of `Read<unknown>` and all possible error types. We can utilize an `instanceof` check to narrow the `result` before accessing the read value.

```ts
if (result instanceof Error) {
  throw result;
}
result.value;
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

### Utilizing the Package in a NodeJS Project

Build the NPM package and link it locally.

```sh
deno task build_npm_pkg && cd target/npm && npm link
```

From the project in which you wish to use Capi...

```ts
npm link capi
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
