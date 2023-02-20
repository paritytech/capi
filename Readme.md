# Capi

> Capi is a work in progress. The documentation may not reflect the current implementation. **Expect a stable release and proper documentation in early 2023**.

<!-- dinodoc fragment.start docs/_fragments/description -->

Capi is a declarative, TypeScript-first toolkit for crafting interactions with Substrate-based chains. It consists of [FRAME](https://docs.substrate.io/reference/glossary/#frame) utilities, a functional effect system ([Rune](/rune)) and a fluent API, which facilitates multistep, multichain interactions without compromising either performance or ease of use.

<!-- dinodoc fragment.end -->

- [Examples &rarr;](./examples)<br />SHOW ME THE CODE
- [Docs &rarr;](./docs/introduction.md)<br />Guides for Capi developers and pattern library developers
- [API Reference &rarr;](https://deno.land/x/capi/mod.ts)<br />A generated API reference, based on type signatures and in-source comments.

## At a Glance

Create an import map (a web platform standard) with the specifier(s) corresponding to your provider and chain discovery value (in this case a WebSocket URL).

`import_map.json`

```json
{
  "imports": {
    "polkadot/": "http://localhost:4646/frame/wss/rpc.polkadot.io/@latest/"
  }
}
```

Run the Capi development server.

```sh
deno run -A https://deno.land/x/capi/main.ts
```

Then, open your editor and import bindings from the local server.

```ts
import { System } from "polkadot/mod.ts"

const key = System.Account
  .keyPage(1) // we want one key in the key page
  .access(0) // let's take the first
  .unhandle(undefined) // we know it's not `undefined`

const value = System.Account.entry(key)

console.log(await value.run())
```

## Running Examples

<!-- TODO: track https://github.com/denoland/dotland/issues/2650#issuecomment-1437015262 -->

```sh
deno run -A https://deno.land/x/capi/main.ts -- \
  https://deno.land/x/capi/examples/<example-name>.ts \
  --import-map=https://deno.land/x/capi/import_map.json
```

## The Thesis

In a likely future of specialized, interoperable chains, developers will need to make use of on-chain programs to satisfy varying use cases; the expertise required to interact with these on-chain programs is currently greater than that which _should_ be expected of app developers. Does this mean that app developers must forgo integrating with this blossoming infrastructure? We think not; **the open source community can use Capi to abstract over the atomics of the on-chain world**. An interaction spanning several chains and dozens of methods can be described with a single Rune[^1].

As you read through this documentation, please consider use cases over which you might like to abstract; if you wish to add your use case to [Capi's standard library](patterns), please [submit an issue](https://github.com/paritytech/capi/issues/new?title=pattern%20idea:%20).

## Code of Conduct

Everyone interacting in this repo is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).

## Contributing

Contributions are welcome and appreciated! Check out the [contributing guide](CONTRIBUTING.md) before you dive in.

## License

Capi is [Apache licensed](LICENSE).

[^1]: Rune is the unit of composition with which we model Capi programs. See [docs/basics/rune.md](docs/basics/rune.md).
