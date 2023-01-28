# Capi

> Capi is a work in progress. The documentation may not reflect the current implementation. **Expect a stable release and proper documentation in early 2023**.

Capi is a declarative, TypeScript-first toolkit for crafting interactions with Substrate-based chains. It consists of [FRAME](https://docs.substrate.io/reference/glossary/#frame) utilities and [a high-level functional effect system](https://github.com/paritytech/zones) and [effects](./effects), which facilitate multistep, multichain interactions without compromising either performance or safety.

- [Examples &rarr;](./examples)<br />SHOW ME THE CODE
- [API Reference &rarr;](https://deno.land/x/capi/mod.ts)<br />A generated API reference, based on type signatures and in-source comments.
- [Type Conversion Guide &rarr;](./docs/Types.md)<br />Guide for Capi's conversion of types from Rust to TypeScript

## At a Glance

Run the local server.

```sh
deno run -A https://deno.land/x/capi/main.ts
```

Then, open your IDE and import pallet-corresponding modules from the local server.

```ts
import { System } from "http://localhost:4646/frame/wss/rpc.polkadot.io/@<chain-version>/mod.ts"

const key = System.Account.keys().first()

const value = System.Account.entry(key)

console.log(await value.run())
```

### Import Mapping

For simplicity, we recommend aliasing import specifiers via import maps.

`import_map.json`

```json
{
  "imports": {
    "#polkadot/": "http://localhost:4646/frame/wss/rpc.polkadot.io/@<chain-version>/"
  }
}
```

```diff
- import { System } from "http://localhost:4646/frame/wss/rpc.polkadot.io/@<chain-version>/mod.ts"
+ import { System } from "#polkadot/mod.ts"
```

## Examples

See [the `examples/` directory](./examples).

```sh
git clone https://github.com/partitytech/capi
cd capi
deno task run codegen # host the server locally and cache all codegen
deno task run examples/<example-name>.ts
```

## The Thesis

In a likely future of specialized, interoperable chains, developers will need to make use of on-chain programs to satisfy varying use cases; the expertise required to interact with these on-chain programs is currently greater than that which _should_ be expected of app developers. Does this mean that app developers must forgo integrating with this blossoming infrastructure? We think not; **the open source community can use Capi to abstract over the atomics of the on-chain world**. An interaction spanning several chains and dozens of methods can be described with a single effect.

As you read through this documentation, please consider use cases over which you might like to abstract; if you wish to add your use case to [Capi's standard library](effects), please [submit an issue](https://github.com/paritytech/capi/issues/new).

## Code of Conduct

Everyone interacting in this repo is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).

## Contributing

Contributions are welcome and appreciated! Check out the [contributing guide](CONTRIBUTING.md) before you dive in.

## License

Capi is [Apache licensed](LICENSE).
