# Import Mapping

## Convenience

Capi server import specifiers can be lengthy.

```ts
import { chain } from "http://localhost:4646/frame/dev/polkadot/@latest/mod.ts"
```

One way to avoid needing to regularly write the same specifier(s) is to utilize import maps, a standard ECMAScript feature that allows for import aliasing.

Define an import map like so.

```json
{
  "imports": {
    "polkadot_dev/": "http://localhost:4646/frame/dev/polkadot/@latest/"
  }
}
```

Using this import map, we can adjust our import specifier from above to its import-mapped counterpart.

```diff
- import { chain } from "http://localhost:4646/frame/dev/polkadot/@latest/mod.ts"
+ import { chain } from "polkadot_dev/mod.ts"
```

## Development vs. Production

Import maps are especially useful for toggling between development and production usage.

Let's say we have a script that retrieves the first ten entries from the system's accounts.

`my_script.ts`

```ts
import { System } from "polkadot/mod.ts"

const firstTen = await System.Account.entryPage(10).run()
```

In development, we can have a `dev_import_map.json`, which redirects `polkadot/` to the `dev` provider.

```sh
deno task capi -- deno run -A my_script.ts --import-map=dev_import_map.json
```

In production, we can easily redirect to the live network.

`prod_import_map.json`

```diff
{
  "imports": {
-   "polkadot/": "http://localhost:4646/frame/dev/polkadot/@latest/"
+   "polkadot/": "http://localhost:4646/frame/wss/rpc.polkadot.io/@latest/"
  }
}
```

```diff
- deno task capi -- deno run -A my_script.ts --import-map=dev_import_map.json
+ deno task capi -- deno run -A my_script.ts --import-map=prod_import_map.json
```

This approach allows us to move between development and production stages with little-to-no changes to our JS/TS code itself. This is especially useful for the development of Capi libraries.

## Scoping

TODO: decide whether we want to advocate for this approach –– the approach described by #656 is likely preferable.
