# Setup

We can interact with either a local Capi server or the hosted version on [capi.dev](https://capi.dev)

> Note: test net providers are unavailable when importing from the hosted Capi server.

## Running Locally

### Deno

Add the `capi` task to your Deno config.

`deno.jsonc`

```diff
// ...
  "tasks": {
+   "capi": "deno run -A https://deno.land/x/capi/main.ts"
// ...
```

We can now use `deno task capi` to run the Capi server.

### NodeJS

Install Capi via your NPM client of choice (in this example, we use the NPM CLI directly).

```sh
npm i capi
```

Add the `capi` script to your `package.json`.

`package.json`

```diff
// ...
  "scripts": {
+   "capi": "capi"
// ...
```

We can now use `npm run capi` to run the Capi server.

## [capi.dev](https://capi.dev)

We can forgo installation if comfortable with a hosted version of the Capi server. This allows us to execute Capi scripts without needing to install dependencies.

```ts
import { chain } from "https://capi.dev/frame/wss/rpc.polkadot.io/@latest/mod.ts"
```
