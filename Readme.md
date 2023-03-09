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

## At a Glance

Run the Capi development server.

```sh
deno run -A https://deno.land/x/capi/main.ts
```

Create an import map with the specifier corresponding to your target.

`import_map.json`

```json
{
  "imports": {
    "@capi/polkadot/": "http://localhost:4646/frame/wss/rpc.polkadot.io/@latest/"
  }
}
```

Then, open your editor and import from the mapped chain module.

```ts
import { System } from "@capi/polkadot/mod.ts"

const key = System.Account
  .keyPage(1)
  .access(0)
  .unhandle(undefined)

const value = System.Account.value(key)

console.log(await value.run())
```

## Running Examples

Within a fresh clone of the repository...

<!-- TODO: track https://github.com/denoland/dotland/issues/2650#issuecomment-1437015262 -->

```sh
deno task run examples/<example_name>.ts
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
