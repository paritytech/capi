# Capi

> [Announcing Capi v0.1.0-gamma.0](https://docs.capi.dev/blog/2023/06/29/v0.1.0-gamma.0)

Capi is a framework for crafting interactions with Substrate chains. It consists
of a development server and fluent API, which facilitates multichain
interactions without compromising either performance or ease of use.

- [Manual &rarr;](https://docs.capi.dev)<br />Guides to get up and running
- [Examples &rarr;](./examples)<br />SHOW ME THE CODE
- [API Reference &rarr;](https://deno.land/x/capi/mod.ts)<br />A generated API
  reference, based on type signatures and TSDocs.

## Installation

```sh
npm i capi
```

<details>
<summary>Deno Equivalent</summary>
<br>

`import_map.json`

```json
{
  "imports": {
    "capi": "https://deno.land/x/capi/mod.ts",
    "capi/nets": "https://deno.land/x/capi/nets/mod.ts"
  }
}
```

</details>

## Configuration

Create a `nets.ts` and specify the chains with which you'd like to interact.

```ts
import { bins, net } from "capi/nets"

const bin = bins({ polkadot: ["polkadot", "v0.9.38"] })

// A Polkadot development network
export const polkadotDev = net.dev({
  bin: bin.polkadot,
  chain: "polkadot-dev",
})

// The Polkadot relay chain
export const polkadot = net.ws({
  url: "wss://rpc.polkadot.io/",
  targets: { dev: polkadotDev },
})
```

## Command Line Tool

In this documentation, we use Capi's CLI via the alias "capi", instead of via
its full path:

```sh
./node_modules/.bin/capi
```

<details>
<summary>Deno Equivalent</summary>
<br>

```sh
deno run -A https://deno.land/x/capi/main.ts
```

</details>

## Codegen Chain-specific APIs

```sh
capi sync node
```

<details>
<summary>Deno Equivalent</summary>
<br>

```sh
capi sync deno
```

</details>

## At a Glance

Retrieve the first 10 entries from a storage map of Polkadot.

```ts
import { polkadot } from "@capi/polkadot"

const accounts = await polkadot.System.Account.entries({ limit: 10 }).run()
```

## Development Networks

During development, we may want to swap out the underlying connection with that
of a devnet. This can be achieved via targets — by specifying alternate targets
in your `nets.ts` file, you can switch to them by wrapping your command with
`capi serve --target someTarget --`. For example:

```sh
capi serve --target dev -- node main.js
```

> Other examples:
>
> - `capi serve --target dev -- npm run start`
> - `capi serve --target dev -- deno run -A ./main.ts`

## Running Examples

Within a fresh clone of this repository...

<!-- TODO: track https://github.com/denoland/dotland/issues/2650#issuecomment-1437015262 -->

```sh
deno task sync # only needed once
deno task run examples/<example_path>
```

## Rationale

In a likely future of specialized, interoperable chains, developers will need to
make use of on-chain programs to satisfy varying use cases; the expertise
required to interact with these on-chain programs is currently greater than that
which _should_ be expected of app developers. Does this mean that app developers
must forgo integrating with this blossoming infrastructure? We think not; **the
open source community can use Capi to abstract over the atomics of the on-chain
world**. An interaction spanning several chains and dozens of methods can be
described with a single Rune[^1].

As you read through this documentation, please consider use cases over which you
might like to abstract; if you wish to add your use case to
[Capi's standard library](patterns), please
[submit an issue](https://github.com/paritytech/capi/issues/new?title=pattern%20idea:%20).

## Code of Conduct

Everyone interacting in this repo is expected to follow the
[code of conduct](CODE_OF_CONDUCT.md).

## Contributing

Contributions are welcome and appreciated! Check out the
[contributing guide](CONTRIBUTING.md) before you dive in.

## License

Capi is [Apache licensed](LICENSE).

[^1]: Rune is the unit of composition with which we model Capi programs.
