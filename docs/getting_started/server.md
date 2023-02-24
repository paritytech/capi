# Server

The Capi server has several responsibilities:

- Serving the Capi runtime library itself
- Receiving import requests and serving back chain-specific APIs (codegen on-the-fly)
- Managing test network processes and users
- Serving a browser application for exploring the documentation of a given chain

## Imports And Intellisense

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

## Capi Files

## Codegen Type

## Providers

- local vs. Remote table

## Runtime Version

## Generated Files
