# Import Mapping

## Convenience

Capi server import specifiers can be lengthy.

```ts
import { chain } from "http://localhost:4646/frame/dev/polkadot/@latest/mod.ts"
```

One way to avoid needing to regularly write the same specifier(s) is to utilize import maps, a standard ECMAScript feature that allows for import aliasing.

Define an import map like so.

`dev_import_map.json`

```json
{
  "imports": {
    "polkadot/": "http://localhost:4646/frame/dev/polkadot/@latest/"
  }
}
```

Using this import map, we can adjust our import specifier from above to its import-mapped counterpart.

```diff
- import { chain } from "http://localhost:4646/frame/dev/polkadot/@latest/mod.ts"
+ import { chain } from "polkadot/mod.ts"
```

## Executing Import-mapped Code

Specificity of import maps varies between runtimes.

### Deno

In Deno, use the `--import-map=<path>` argument.

```diff
- deno task capi -- deno run -A my_script.ts
+ deno task capi -- deno run -A --import-map=dev_import_map.json my_script.ts
```

### Browser

In browser, use the `importmap` type in an HTML `script` tag.

```html
<script type="importmap" src="/dev_import_map.json"></script>
```

### Node

Node does not yet provide built-in support for import maps (see [nodejs/modules#477](https://github.com/nodejs/modules/issues/477)). However, we can use `import-maps`, a `require`-hijacking package to preprocess subsequent imports.

```js
import { importMap } from "import-maps"

importMap("./dev_import_map.json")
```

TODO: confirm that this does indeed work

## Development vs. Production

Import maps are especially useful for toggling between development and production usage.

Let's say we have a script that retrieves the first ten entries from the system pallet's account storage.

`my_script.ts`

```ts
import { System } from "polkadot/mod.ts"

const firstTen = await System.Account.entryPage(10).run()
```

In development, we can have a `dev_import_map.json`, which redirects `polkadot/` to the `dev` provider. This will give us ten accounts corresponding to test users (alice, bob, misc.).

```sh
deno task capi -- deno run -A my_script.ts --import-map=dev_import_map.json
```

In production, we can easily redirect to the live network, therein giving us real accounts.

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

This approach allows us to move between development and production stages with little-to-no changes to our JS/TS code itself. This is especially useful for the development of Capi libraries, as we can write code with import specifiers that are intended for overriding.

## Scoping

TODO: decide whether we want to advocate for this approach –– the approach described by #656 is likely preferable.
