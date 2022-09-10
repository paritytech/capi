# Reading

## A Basic Example

Let's read some data from the on-chain world.

```ts
import { config as polkadot } from "https://deno.land/x/capi-polkadot@0.1.0/mod.ts";
import * as C from "https://deno.land/x/capi@0.1.0/mod.ts";

// Get a reference to the accounts map
const accounts = C.map(polkadot, "System", "Account");

// Get a reference to the last inserted key of the map
const key = accounts.keys().first();

// Get a reference to the corresponding value
const value = accounts.get(lastInserted);

// Finally, run `value` (a lazy description, aka. an "Effect")
console.log(C.run(value));
```
