# Reading

## A Basic Example

Let's read some data from the on-chain world.

<!-- dprint-ignore -->

```ts
import * as C from "capi";
import { config as polkadot } from "@capi/polkadot";

// Get a reference to the accounts map
const accounts = C.map(polkadot, "System", "Account");

// Get a reference to the last inserted key of the map
const key = accounts.keys().first();

// Read the corresponding value
const result = await accounts.get(key).read();
```
