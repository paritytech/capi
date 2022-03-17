# Capi

Capi (Chain API) is a TypeScript toolkit for crafting interactions with Substrate-based chains.

⚠️ Capi is a work in progress. Many of its core features (such as the sending of extrinsics) are yet to be implemented. It is fraught with edge cases and `TODO` comments. [Here is a partial todo list](./_/assets/todo.md). If interested in working on Capi, please reach out to `@harrysolovay:matrix.parity.io`.

## Overview

At a birds-eye view, **there are two distinct versions of the Capi developer experience**:

- [A "dynamic" DX](./_/assets/dynamic_dx.md) for developers who do not have ahead-of-time knowledge of which chain(s) they are targeting. Their programs must reflect on chain capabilities and derive transcoders at runtime.
- [A statically generated DX](./_/assets/static_dx.md) for developers who do know which chain(s) they are targeting. These developers use the Capi CLI to generate efficient, type-safe bindings to chain resources.

Both of these DXs are powered by [an underlying functional effect system](./_/assets/effects.md), inspired by [Zio](https://zio.dev/) and [EffectTS](https://github.com/effect-ts). These systems abstract over computation (in our case network interactions) such that it can be reduced and cooperatively scheduled (among other optimizations). Effects also offer type-safe error handling, dependency injection and a pleasant, functional-feeling DX.

## Testing

We have yet to publish Capi to [deno.land/x](https://deno.land/x) or [NPM](https://www.npmjs.com/). For now, clone [`paritytech/capi`](https://github.com/paritytech/capi).

> In the future, Gitpod and dev containers will simplify spinning up a Capi development environments. The [Dockerfile](./Dockerfile), [Gitpod configuration](./.gitpod.yml), [Dev Containers / Codespaces configuration](./.devcontainer/devcontainer.json) and [bootstrap task](./_/tasks/bootstrap.ts) are in need some finessing.

Make sure you have the following installed on your machine (and please submit issues if errors crop up).

### System Requirements

- [Rustup](https://www.rust-lang.org/tools/install) and the wasm32-unknown-unknown target
- [Deno](https://deno.land/manual@v1.19.3/getting_started/installation)
- [Docker](https://docs.docker.com/get-docker/)
- [NodeJS](https://nodejs.org/) (only necessary if you're going to run [the build_npm task](./_/tasks/build_npm.ts))

### Bootstrapping

After cloning the repository, CD into it and execute the following.

```sh
./_/task.ts bootstrap
```

### Running an Example

After running the bootstrap script, you should be able to run any of the examples.

```sh
./examples/balances.ts
```

## Code Structure

You may have noticed that the Capi repository looks somewhat different from a traditional TypeScript repository. This is because Capi developed Deno-first. For those unfamiliar, [Deno](https://deno.land/) is a TypeScript runtime and toolkit written in Rust. Unlike NodeJS, Deno emphasizes web standards and exposes a performant and type-safe standard library. Deno-first TypeScript can be easily packaged for consumption in NodeJS, Browsers, CloudFlare Workers and other environments. Some things to note:

### No `src` nor Distinct `package/*`

We no longer need to think about the separation of code for the sake of packaging. We can think about separation of code in terms of what best suits our development needs.

For example, exports of [`_/util/types.ts`](./_/util/types.ts) can be imported directly into any other TypeScript file, without specifying the dependency in a package manifest. We are free to use `bearer.ts` in out-of-band processes, the CLI or even GitHub action scripts. From anywhere in the repository, we can import and use any code. No configuration overhead.

When it comes time to [build our code](./_/tasks/build_npm.ts) for NPM distribution, [DNT](https://github.com/denoland/dnt) takes care of transforming our dependency graph into something that NodeJS projects will understand.

### Import Mapping

In the Capi repository (and all Deno-first repositories) there is no package manifest. We do not specify imports in some central file. While we could certainly create a `deps.ts`/`barrel.ts`/`prelude.ts` at the root and re-export dependencies, that would not be Deno-idiomatic. Instead, we define an [import map (`import_map.json`)](./import_map.json) (import maps are a web standard), which maps leading text of import specifiers. In our case, we add mappings to enable root-relative references. For instance:

Let's say we're inside of `frame/Metadata.ts` and we want to import `Resource` from `system/Resource.ts`.

**Instead of writing this**...

```ts
import { Resource } from "../system/Resource.ts";
```

... **we write this**:

```ts
import { Resource } from "/system/Resource.ts";
```

Now, if we ever move our `Metadata.ts` elsewhere, its imports remain valid.

### Why All the `_` Directories?

In the world of NodeJS, we might expose specific functionality with a `package.json`'s `main`, `module` and/or `exports` fields. This is not the case in Deno projects. Deno users often (and in the case of Capi) consume libraries via published source code. Then, the user's own build processes are responsible for transforming that source code into the desired flavor or target. Users may bring Capi into their projects as follows.

```ts
import * as frame from "https://deno.land/x/capi@0.1.0/frame/mod.ts";
```

The `_` convention makes obvious a separation between the well-defined API surface and implementation details, which are not guaranteed to be consistent.
