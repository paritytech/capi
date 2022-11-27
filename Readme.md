# Capi

> Capi is a work in progress. The documentation may not reflect the current implementation. **Expect a stable release and proper documentation in early 2023**.

Capi is a declarative, TypeScript-first toolkit for crafting interactions with Substrate-based chains. It consists of [FRAME](https://docs.substrate.io/v3/runtime/frame/) utilities and [a high-level functional effect system](https://github.com/paritytech/zones) and [effects](./effects), which facilitate multistep, multichain interactions without compromising either performance or safety.

- [Examples &rarr;](./examples)<br />SHOW ME THE CODE
- [API Reference &rarr;](https://deno.land/x/capi/mod.ts)<br />A generated API reference, based on type signatures and in-source comments.
- [Type Conversion Guide &rarr;](./docs/Types.md)<br />Guide for Capi's conversion of types from Rust to TypeScript

## At a Glance

```ts
import { System } from "https://capi.dev/proxy/wss:rpc.polkadot.io/pallets/mod.ts"

const key = System.Account.keys().first()

const value = System.Account.entry(key)

console.log(await value.run())
```

> Note: although the codegen server is hosted on https://capi.dev, we encourage you to run it locally with
>
> ```sh
> deno run -A https://deno.land/x/capi/serve.ts
> ```

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
