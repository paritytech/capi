# Testing

> TODO: add more upon [Zombienet integration](https://github.com/paritytech/capi/issues/215).

Before interacting with a live network, you may find it worthwhile to spawn a local chain and test out your interaction.

## Run a Local Test Network

> Note: the following makes use of [Polkadot](https://github.com/paritytech/polkadot), the installation instructions of which can be found [here](https://github.com/paritytech/polkadot#installation).

## Map to Test Config

Under the hood, a given "config" encapsulates the value(s) utilized to discover a given chain (RPC proxy URLs and chain specs). To utilize a test config, we can utilize an import map.

Let's say you have the following usage.

`example.ts`

```ts
import * as C from "capi";
import { system } from "./polkadot/frame.ts";

const result = await C.run(system.events);
```

Create an import map.

`test_import_map.json`

```json
{
  "./polkadot/config.ts": "capi/test_util/configs/polkadot.ts"
}
```

Specify the import map when you run your code.

```diff
- deno run -A example.ts
+ deno run -A example.ts --import-map="test_import_map.json"
```

Under the hood, this usage will spawn a local dev chain and re-route to a corresponding config.

---

Now that we've covered spawning and interacting with a local test network, let's cover [the effect system](./Effects.md), which enables us to model complex interactions spanning many chains and then optimally-execute those descriptions.
