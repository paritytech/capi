# Static

⚠️ This experience is not yet functional. Give me a week or so ;)

## Create a `capi.jsonc` (JSON schema defined [here](../../config/Raw.ts))

```jsonc
{
  // For type safety, reference the schema
  "$schema": "https://json.schemastore.org/capi.jsonc",

  // Specify––via RPC Proxy WebSocket URL––which chain(s) you're targeting
  "chains": {
    "polkadot": "wss://rpc.polkadot.io"
  },

  "target": {
    // What flavor of module specifier?
    "capi": "denoland_x", // ... or perhaps `"npm"`
    // Where would you like to output the generated bindings?
    "outDir": "generated"
  }
}
```

The [`examples/capi.jsonc`](./../../examples/capi.jsonc) is configured to point to the local version of Capi (this very repo).

## Run the Code Generation

**For now**, let's run the codegen locally.

```sh
./cli/bin.ts frame codegen --base-dir examples
```

**Eventually**, the codegen CLI will be used as follows.

```sh
capi frame codegen
```

## Use the Generated Effects

`examples/using_generated.ts`

```ts
import * as frame from "/frame/mod.ts";
import { Account } from "./generated/frame/polkadot/System/storage.ts";

// Create a shared container for inflight requests, caches, etc.
const exec = frame.exec();

// Use the generated binding
const storageMapValue = Account.get(PUB_KEY_BYTES);

// Initiate the request
const result = await exec(storageMapValue);
```
