# Types

The types of the on-chain world are declared in the given chain's Rust source code. While many types may remain consistent across chains, many may differ. On one chain, `AccountData` may be defined with fields describing fungible assets; on another (hypothetical) chain, perhaps `AccountData` references non-fungible assets, reputation, linked accounts or something else entirely. Although FRAME certainly helps to standardize chain properties, those properties can be customized to the extent that we cannot make assumptions regarding shapes of data across chains. Additionally, types can change upon runtime upgrades; your assumptions about the shape of a type may become invalid; to interact with these highly-dynamic on-chain environments––and to do so from a JavaScript environment––poses inherent difficulty. We JS developers must (A) think in terms of Rust data types and (B) keep a lookout for breaking changes to chain runtimes. This document does not provide a silver-bullet solution to this complexity. But it should provide the background necessary for you to address types for your specific use cases.

## Learning About Types

Let's cover how to learn about a chain's types/properties.

<!-- ### [capi.dev](https://capi.dev/) -->

### FRAME Metadata

Every FRAME chain exposes metadata about its types and properties. This metadata is called the "FRAME Metadata." Let's retrieve and inspect it.

As always, our first step is to bring Capi into scope.

```ts
import * as C from "https://deno.land/x/capi/mod.ts";
```

Now let's fetch the metadata.

```ts
// ...

const metadata = await C.chain(CHAIN_PROXY_WS_URL).metadata.read();
```

If we index into `metadata.pallets`, we'll see a list of all pallet metadata. Each element of this list contains a complete description of the given pallet's storage entries, as well as constants, callables (for creating extrinsics), errors and events. Some fields––such as a pallet's `call` field––point to an index in `metadata.types`, which contains a complete description of the chain's type-level context.

Let's say we want to learn about the types associated with the `Balances` pallet's `Account` storage.

```ts
// ...

const balancesPallet = metadata.pallets.find((pallet) => pallet.name === "Balances");
const accountsStorage = balancesPallet?.storage?.entries.find((entry) => entry.name === "Account");
```

On most chains, `accountsStorage` will look similar to the following.

````ts
{
  name: "Account",
  modifier: 1,
  _tag: 1,
  hashers: [ "Blake2_128Concat" ],
  key: 0,
  value: 5,
  default: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ],
  docs: [
    " The Balances pallet example of storing the balance of an account.",
    "",
    " # Example",
    "",
    " ```nocompile",
    "  impl pallet_balances::Config for Runtime {",
    "    type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, Acco...",
    "  }",
    " ```",
    "",
    " You can also store the balance of an account in the `System` pallet.",
    "",
    " # Example",
    "",
    " ```nocompile",
    "  impl pallet_balances::Config for Runtime {",
    "   type AccountStore = System",
    "  }",
    " ```",
    "",
    " But this comes with tradeoffs, storing account balances in the system pallet stores",
    " `frame_system` data alongside the account data contrary to storing account balances in the",
    " `Balances` pallet, which uses a `StorageMap` to store balances data only.",
    " NOTE: This is only used in the case that this pallet is used to store balances."
  ]
}
````

- `_tag` tells us that this storage is that of a map, not a plain entry (standalone value).
- `key` tells us what type of value we need to use as the key for indexing into the map.
- `value` tells us what we can expect to retrieve from the map.

Let's index into `metadata.types` with the specified key (`0`).

```ts
const keyType = metadata.types[accountsStorage.key];
```

`keyType` should evaluate to something along the lines of:

```ts
{
  i: 0,
  path: ["sp_core", "crypto", "AccountId32"],
  params: [],
  _tag: "Struct",
  fields: [{ name: undefined, type: 1, typeName: "[u8; 32]", docs: [] }],
  docs: [],
};
```

If we index again into `metadata.types` with `1` (as specified in the first field), we'll see the inner types (in this case a 32-element tuple of `u8`s). From these descriptions, we can roughly deduce the JS equivalent.

```ts
namespace sp_core {
  export namespace crypto {
    // Note: `Uint8Array` lengths are untyped in TypeScript
    export type AccountId32 = Uint8Array;
  }
}
```

We can put instantiate this as we would any other JS-land instance.

```ts
const accountId32 = new Uint8Array(...RAW_ADDR_BYTES);
```

We'll cover the TypeScript <-> Rust conversions more in depth [in a later section](#typescript---rust).

Let's now utilize our `accountId32` definition to read a balance.

```ts
// ...

// Which storage map?
const accounts = C.pallet("Balances").storageMap("Account");

// Which key?
const key = accounts.key(C.AccountId32.fromRaw(BYTES));

// Read the value.
const account = await accounts.get(key).read();
```

If we take a look at `Read` member of the signature of `account`, we see its inner type is `unknown`. We cannot reliably know the narrow type (at least not without [codegen](./Codegen.md)). So how might we deduce the type of successfully-retrieved values.

We can do the same as before, but this time index into `metadata.types` with the `accountsStorage.value`.

```ts
const valueType = metadata.types[accountsStorage.value];
```

This should give us something along the following lines:

```ts
{
  i: 5,
  path: ["pallet_balances", "AccountData"],
  params: [{ name: "Balance", type: 6 }],
  _tag: "Struct",
  fields: [
    { name: "free", type: 6, typeName: "Balance", docs: [] },
    { name: "reserved", type: 6, typeName: "Balance", docs: [] },
    { name: "misc_frozen", type: 6, typeName: "Balance", docs: [] },
    { name: "fee_frozen", type: 6, typeName: "Balance", docs: [] },
  ],
  docs: [],
};
```

When we follow type `6` (metadata.types[6]), we see that it represents a `u128`. In TypeScript, this translates to a `bigint`. Therefore, the complete JS-land structure looks as follows.

```ts
namespace pallet_balances {
  export interface AccountData {
    free: bigint;
    reserved: bigint;
    misc_frozen: bigint;
    fee_frozen: bigint;
  }
}
```

> Note: we can ignore the `params` field of the `AccountData` metadata, as the type param is already applied to the field metadata.

## TypeScript <-> Rust

TODO

<!-- https://github.com/paritytech/capi/pull/73 -->

| TypeScript | Rust     |
| ---------- | -------- |
| `null`     | `()`     |
| `A`        | `(A)`    |
| `[A, B]`   | `(A, B)` |
| `T[]`      | `Vec<T>` |

## Runtime Validation

TODO

---

Let's look at a concrete example: accessing a user's `AccountData`.

In this storage read example, `account` is a union of possible errors and the success value. If we take a look at the signature of `account`, we see that the non-error union member is of type `Read<unknown>`.

## Access The "Ok" Value

There are several ways to unwrap the inner value. The recommended path is to first check for and handle all possible errors.

```ts
if (account instanceof Error) {
  // Handle errors here.
} else {
  account.value; // `unknown`
}
```

In situations where convenience is a priority (such as these very docs), we can simply call the `unwrap` method of the result.

```ts
const value = account.unwrap();
```

TODO
