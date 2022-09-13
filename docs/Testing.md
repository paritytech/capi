# Testing

> TODO: add more upon [Zombienet integration](https://github.com/paritytech/capi/issues/215).

Before interacting with a live network, you may find it worthwhile to spawn a local chain and test out your interaction.

## Run a Local Test Network

> Note: the following makes use of [Polkadot](https://github.com/paritytech/polkadot), the installation instructions of which can be found [here](https://github.com/paritytech/polkadot#installation).

```sh
polkadot --dev --ws-port=ws://127.0.0.1:9944
```

## Specify Local `src`

Let's update our codegen task with the local test chain's WebSocket URL.

```diff
deno run -A -r https://deno.land/x/capi/codegen.ts \
- --out="polkadot.ts" \
+ --out="polkadot-dev.ts" \
- --src="wss://rpc.polkadot.io"
+ --src="ws://127.0.0.1:9944"
```

## Use as You Would Normally

```ts
import * as polkadot from "./polkadot-dev.ts";

const events = await polkadot.system.events().read();

if (!(events instanceof Error)) {
  events.length; // will be `0`, unless you trigger some events within preceding test code!
}
```

---

Now that we've covered spawning and interacting with a local test network, let's cover [the effect system](./Effects.md), which enables our lazily-evaluated descriptions of our interactions.
