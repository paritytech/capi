# Capi

> Capi is a work in progress. The documentation may not reflect the current
> implementation. **Expect a stable release and proper documentation in early
> 2023**.

Capi is a framework for crafting interactions with Substrate chains. It consists
of a development server and fluent API, which facilitates multistep, multichain
interactions without compromising either performance or ease of use.

- [Docs &rarr;](https://docs.capi.dev)<br />Guides for Capi developers and
  pattern library developers
- [Examples &rarr;](./examples)<br />SHOW ME THE CODE
- [API Reference &rarr;](https://deno.land/x/capi/mod.ts)<br />A generated API
  reference, based on type signatures and TSDocs.

## Installation

### [Node.js](https://nodejs.org/)

```sh
npm i capi https://capi.dev/frame/wss/rpc.polkadot.io/@latest/pkg.tar
```

### [Deno](https://deno.land/)

```ts
import {} from "https://capi.dev/frame/wss/rpc.polkadot.io/@latest/mod.js"
```

## At A Glance

```ts
import { System } from "@capi/polkadot"

const accounts = await System.Account.entryPage(10, null).run()
```

## Running Examples

Within a fresh clone of this repository...

<!-- TODO: track https://github.com/denoland/dotland/issues/2650#issuecomment-1437015262 -->

```sh
deno task run examples/<example_file>
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
