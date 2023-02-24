# Server

The Capi server has several responsibilities:

- Serving the Capi runtime library itself
- Receiving import requests and serving back chain-specific APIs (codegen on-the-fly)
- Managing test network processes and users
- Serving a browser application for exploring the documentation of a given chain

## Imports

We primarily use import specifiers as a way of telling the Capi server what it is that we want.

```ts
import {
  // ...
} from "http://localhost:4646/frame/wss/rpc.polkadot.io/@latest/mod.js"
//                            ~~~~~ ~~~~~~~~~~~~~~~~~~~ ~~~~~~~ ~~~~~~
//                            ^     ^                   ^       ^
//                            |     |                   |       chain file
//                            |     |                   |
//                            |     |                   runtime version
//                            |     |
//                            |     target
//                            |
//                            codegen type
```

In this example, we ask the server for the following:

- `frame` is the type of codegen with which we want the server to produce our chain-specific API
- `wss/rpc.polkadot.io` is the target. `wss` indicates the provider, while `rpc.polkadot.io` is the means of provider-specific discovery (a WebSocket URL)
- `@latest` is the semver string associated with the chain runtime version whose metadata we want to use for codegen (best to pin to a specific version<!-- TODO(@tjjfvi): brief description of why it's best to pin -->)
- `mod.js` is the codegened file from which we'd like to import. We could just as easily import from other generated files, such as `Balances.ts` (a specific pallet bindings file) or `types/frame_system/mod.ts` (a file of declarations, guards, factories and raw SCALE codecs).

### Intellisense

To ease the burden of writing these import specifiers, the Capi server implements intellisense in accordance with [Deno's language server intellisense API](https://deno.land/manual@v1.31.0/advanced/language_server/imports). This affords us autocompletion as we write out our import statements.

<!-- TODO: add screenshot -->

> Note: TODO: describe status of intellisense for NodeJS projects / TS language server

## The Capi Library

For retrieving common utilities (such as test pairs and assertions), import from the server's root `mod.ts`, which exports the Capi library itself.

```ts
import { alice } from "http://localhost:4646/mod.ts"
```

Visit [deno.land/x/capi](https://deno.land/x/capi) to explore this module's exports.

## Providers

Providers are the means by which we target a given chain during development.

### Production Providers

| junction | description                                                              | example                           |
| -------- | ------------------------------------------------------------------------ | --------------------------------- |
| metadata | Codegens based on the metadata contained within the specified scale file | `metadata/path/to/metadata.scale` |
| wss      | Codegens based on the metadata retrieved through the specified proxy URL | `wss/rpc.polkadot.io`             |

### Development Providers

| junction  | description                                                                                   | example                                   |
| --------- | --------------------------------------------------------------------------------------------- | ----------------------------------------- |
| dev       | Spawns and codegens from on a polkadot dev chain                                              | `dev/polkadot`                            |
| zombienet | Spawns zombienet with the specified config, codegens from the specified node of the zombienet | `zombienet/path/to/config.toml/node_name` |
| project   | Spawns and codegens from a development chain of the current (cwd) Substrate workspace         | `project`                                 |
| contracts | Spawns and codegens from an instance of `substrate-contracts-node`                            | `contracts_dev`                           |

## Runtime Connection Specificity

It should be noted that they are intended to be hot-swapped depending on stage of the development lifecycle.

Let's say I'm developing against `http://localhost:4646/frame/dev/polkadot/@latest/mod.ts`.

## Runtime Version

## Generated Files
