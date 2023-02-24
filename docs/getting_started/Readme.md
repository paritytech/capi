# Getting Started

## Dependencies

Before diving into Capi, let's make sure your environment is configured with the necessary dependency(s).

1. (**Required**) We'll be using either the [Deno](https://github.com/denoland/deno) or [NodeJS](https://github.com/nodejs/node) to run Capi's development server.

2. (**Recommended**) We **may** also want to install a few additional dependencies, which enable Capi's server to spin up ephemeral networks for easy testing. Assuming you'd like to interact with test networks, let's install [`polkadot`](https://github.com/paritytech/polkadot), so that we can test again Polkadot, Kusama, Westend and Rococo.

3. (**Per use case**) For more advanced test network setups, we can install [`zombienet`](https://github.com/paritytech/zombienet) and [`cumulus`](https://github.com/paritytech/cumulus) (in addition to [`polkadot`](https://github.com/paritytech/polkadot)).

4. (**Per use case**) For testing smart contracts, we can install [`substrate-contracts-node`](https://github.com/paritytech/substrate-contracts-node).

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

### With **Node**

```sh
npx capi
```
