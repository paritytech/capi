# Capi

> Capi is a work in progress. The documentation may not reflect the current implementation. **Expect a stable release and proper documentation in early 2023**.

Capi is a declarative, TypeScript-first toolkit for crafting interactions with Substrate-based chains. It consists of [FRAME](https://docs.substrate.io/v3/runtime/frame/) utilities and [a high-level functional effect system](https://github.com/paritytech/zones) and [effects](./effects), which facilitate multistep, multichain interactions without compromising either performance or safety.

- [Documentation &rarr;](./docs/Readme.md)<br />Materials for learning about Capi
- [Examples &rarr;](./examples)<br />SHOW ME THE CODE
- [API Reference &rarr;](https://deno.land/x/capi/mod.ts)<br />A generated API reference, based on type signatures and in-source comments.

## At a Glance

Generate chain-specific bindings.

```sh
deno run -A -r https://deno.land/x/capi/codegen.ts \
  --src="wss://rpc.polkadot.io" \
  --out="polkadot"
```

> ... or use **the Node equivalent**––`npx capi`--with the same arguments.

Make use of those bindings.

```ts
import * as C from "capi"
import { system } from "./polkadot/frame.ts"

// bind to the last inserted key
const key = system.account.keys.first

// bind to the corresponding value
const value = C.run(system.account.get(key))
```

## The Thesis

In a likely future of specialized, interoperable chains, developers will need to make use of on-chain programs to satisfy varying use cases; the expertise required to interact with these on-chain programs is currently greater than that which _should_ be expected of app developers. Does this mean that app developers must forgo integrating with this blossoming infrastructure? We think not; **the open source community can use Capi to abstract over the atomics of the on-chain world**. An interaction spanning several chains and dozens of methods can be described with a single effect.

As you read through this documentation, please consider use cases over which you might like to abstract; if you wish to add your use case to [Capi's standard library](deps/std), please [submit an issue](https://github.com/paritytech/capi/issues/new).

## Code of Conduct

Everyone interacting in this repo is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).

## Contributing

Contributions are welcome and appreciated! Check out the [contributing guide](CONTRIBUTING.md) before you dive in.

## License

Capi is [Apache licensed](LICENSE).
