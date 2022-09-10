# Configs

Before interacting with a given chain, we must have a means of finding nodes of that chain. This means of discovery is called a "config." A config can also contain additional values and type information (more on this below).

Some Parity-administrated chain configs are accessible from the `known` directory. For instance, we can access a Polkadot-specific config as follows.

```ts
import { polkadot } from "capi/known";
```

> In Node projects with old resolution modes, `capi/known` may produce a module-not-found error. In these situations, you can NPM-install and import from `capi-known`.
>
> ```ts
> import { polkadot } from "capi-known";
> ```

Let's use the Polkadot config to read some storage.

```ts
const result = await C
  .readEntry(polkadot, "Staking", "ActiveEra", [])
  .run();
```

## Type Safety

The static type of any config can describe accessible RPC server methods and FRAME metadata. This enables a narrowly-typed experience to flow through all usage of Capi.

### FRAME Types

What happens if––in the example above––we accidentally misspell a junction of the storage key? We get an immediate type error.

```ts
const result = await C
  .readEntry(polkadot, "Stacking", "ActiveEra", [])
  //                   ~~~~~~~~~~
  //                   ^ argument of type 'Stacking' is not assignable to parameter of type 'PolkadotPalletName'.
  .run();
```

### RPC Methods

The same is true for RPC method availability.

```ts
const result = await C.rpcCall(myConfig, "nonexistent_method", []);
//                                       ~~~~~~~~~~~~~~~~~~~~
//                                       ^ argument of type 'nonexistent_method' is not assignable to parameter of type 'existent_method'.
```

## Custom Configs

To generate a config for an unknown chain, simply point the Capi CLI at the RPC URL of a node of the chain.

```sh
deno run -A -r https://deno.land/x/capi/main.ts MyNamespace wss://xyz.network
```

> Note: running the CLI requires that you have the Deno toolchain installed locally

Upon running this command, the CLI will generate a new directory in your current-working directory. By default, this directory is named `configs`, although you can modify this by supplying an `--dir` value.

```diff
- deno run -A -r https://deno.land/x/capi/main.ts MyNamespace wss://xyz.network
+ deno run -A -r https://deno.land/x/capi/main.ts MyNamespace wss://xyz.network --out=my_configs
```

The generated directory will contain a root `mod.ts`, which re-exports the values contained within namespace-specific config definition files (a `my_configs/MyNamespace.ts`, for example).

We can import and utilize these configs as we would from `capi/known`.

```ts
import { myNamespace } from "./my_configs/mod.ts";
```

## Ecosystem Configs

Proprietors and communities of a given chain may want to take ownership of their configs. Although Capi's typegen encodes all possible constraints from the FRAME metadata, there are further constraints from which users may benefit.

```ts
import { xyzChain } from "https://deno.land/x/capi-xyz-chain/mod.ts";
```
