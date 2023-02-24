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
//      ~~~~~~~~~~~~~~~~~~~~~ ~~~~~ ~~~~~~~~~~~~~~~~~~~ ~~~~~~~ ~~~~~~
//      ^                     ^     ^                   ^       ^
//      |                     |     |                   |       chain file
//      |                     |     |                   runtime version
//      |                     |     target
//      |                     codegen type
//      server origin
```

In this example, we use the import specifier to ask for the following:

- `frame` is the type of codegen with which we want the server to produce our chain-specific API
- `wss/rpc.polkadot.io` is the target. `wss` indicates the provider, while `rpc.polkadot.io` is the means of provider-specific discovery (a WebSocket URL)
- `@latest` is the semver string associated with the runtime version whose metadata we want the codegen to target –– it's best to pin to a specific version
- `mod.js` is the chain-specific codegen file from which we'd like to import. We could just as easily import from a specific pallet file (such as `Balances.ts`) or type file (such as `types/frame_system/mod.ts`).

## Capi Files

## Codegen Type

## Providers

- local vs. Remote table

## Runtime Version

## Generated Files
