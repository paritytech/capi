# Setup

We can interact with either a local Capi server or the hosted version on [capi.dev](https://capi.dev)

> Note: test net providers are unavailable when importing from the hosted Capi server.

## Running Locally

### Deno

Add the `capi` task to your Deno config.

`deno.jsonc`

```json
// ...
  "tasks": {
+   "capi": "deno run -A https://deno.land/x/capi/main.ts"
// ...
```

This allows us to interact with the Capi CLI with `deno task capi`.

### NodeJS

Install Capi via your NPM client of choice (in this example, we use the NPM CLI directly).

```sh
npm i capi
```

Add the `capi` script to your `package.json`.

`package.json`

```json
// ...
  "scripts": {
+   "capi": "capi"
// ...
```

This allows us to interact with the Capi CLI with `npm run capi`.

## [capi.dev](https://capi.dev)

We can forgo installation if comfortable with a hosted version of the Capi server. This allows us to execute Capi scripts without needing to install dependencies.

```ts
import { chain } from "https://capi.dev/frame/wss/rpc.polkadot.io/@latest/mod.ts"
```
