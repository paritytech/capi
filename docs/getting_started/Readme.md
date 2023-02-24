# Getting Started

## Dependencies

Before diving into Capi, let's make sure your environment is configured with the necessary dependency(s).

- (**Required**) We'll be using either the [Deno](https://github.com/denoland/deno) or [NodeJS](https://github.com/nodejs/node) to run Capi's development server.

- (**Recommended**) We **may** also want to install a few additional dependencies, which enable Capi's server to spin up ephemeral networks for easy testing. Assuming you'd like to interact with test networks, let's install [`polkadot`](https://github.com/paritytech/polkadot), so that we can test again Polkadot, Kusama, Westend and Rococo.

- (**Per use case**) For more advanced test network setups, we can install [`zombienet`](https://github.com/paritytech/zombienet) and [`cumulus`](https://github.com/paritytech/cumulus) (in addition to [`polkadot`](https://github.com/paritytech/polkadot)).

- (**Per use case**) For testing smart contracts, we can install [`substrate-contracts-node`](https://github.com/paritytech/substrate-contracts-node).

## Run The Capi Server

Run one of the following commands (depending on your preference of runtime).

### With **Deno**

```sh
deno run -A https://deno.land/x/capi/main.ts
```

> Note: we recommend pinning to a specific version of Capi
>
> ```diff
> - deno run -A https://deno.land/x/capi/main.ts
> + deno run -A https://deno.land/x/capi@v0.1.0/main.ts
> ```

### With **NodeJS**

```sh
npx capi
```

Upon running the command, you should see the message `Capi server listening at "http://localhost:4646"`.

> Note: this documentation is written from the standpoint of a Deno user.

## Use The Capi Server

Let's go ahead and import a pallet-corresponding namespace of a Polkadot development chain. In this case, we'll get the agreed-upon time of the latest block from the `Timestamp` pallet.

`main.ts`

```ts
import { Timestamp } from "http://localhost:4646/frame/dev/polkadot/@latest/mod.ts"

const time = await Timestamp.Now.run()

console.log(time)
```

> Note: we can use import maps to simplify import specifiers ([see here](/docs/getting_started/import_mapping.md)).
>
> ```diff
> - import { Timestamp } from "http://localhost:4646/frame/dev/polkadot/@latest/mod.ts"
> + import { Timestamp } from "polkadot_dev/mod.ts"
> ```

Running this script should output a timestamp (a `bigint`).

In this example, the Capi server...

- Receives the request for a local Polkadot development chain and corresponding API
- Spins up the Polkadot development chain
- Uses its metadata to generate a chain-specific API
- Injects a runtime client into the generated API
- Serves the generated API to the requesting script (`main.ts`)

## Key Takeaway

The Capi server is at the heart of our development. It allows us to spin up test networks, generate narrowly-typed, chain-specific APIs and more. In the next section, we'll be covering the Capi server in depth.
