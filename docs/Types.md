# Types

The types of the on-chain world are declared in a given [Substrate](https://substrate.io/)-based chain's (Rust) source code. While many types may remain consistent across chains, many may differ. On one chain, `AccountData` may be defined with fields describing fungible assets; on another (hypothetical) chain, perhaps `AccountData` references non-fungible assets, reputation, linked accounts or something else entirely. Although [FRAME](https://docs.substrate.io/reference/glossary/#frame) certainly helps to standardize chain properties, those properties can be customized to the extent that we cannot make assumptions regarding shapes of data across chains. Additionally, types can change upon [runtime upgrades](https://docs.substrate.io/build/upgrade-the-runtime/); your assumptions about the shape of a type may become invalid; to interact with these highly-dynamic on-chain environments––and to do so from a JavaScript environment––poses inherent difficulty. We JS developers must (A) think in terms of Rust data types and (B) keep a lookout for breaking changes to chain runtimes. This document does not provide a silver-bullet solution to this complexity, but it should provide the background necessary for you to address types for your specific use cases.

If you just want to see how Rust types are transformed by Capi, [skip to the conversion table](#rust-⬌-typescript).

## Learning About Types

Let's cover how to learn about a chain's types/properties.

<!-- ### [capi.dev](https://capi.dev/) -->

### FRAME Metadata

Every FRAME chain exposes metadata about its types and capabilities. This metadata is called the "FRAME Metadata." Let's retrieve and inspect it.

```ts
import { client } from "http://localhost:8000/frame/wss/rpc.polkadot.io/@v0.9.36/mod.ts"
```

> To run the Capi dev server, run `deno run -A https://deno.land/x/capi/main.ts`

Let's connect to Polkadot and fetch the chain's metadata for the present highest block.

```ts
// ...

const metadata = await C.metadata(client)()

console.log(await metadata.run())
```

If we index into `metadata.pallets`, we'll see a list of all pallet metadata. Each element of this list contains a complete description of the given pallet's storage entries, as well as constants, callables (for creating extrinsics), errors and events. Some fields––such as a pallet's `call` field––point to an index in `metadata.tys`, which contains a complete description of the chain's type-level context.

Let's say we want to learn about the types associated with the `Balances` pallet's `Account` storage.

```ts
// ...

const balancesPallet = C.palletMetadata(metadata, "Balances")

const accountsStorage = C.entryMetadata(balancesPallet, "Account")

console.log(await accountsStorage.run())
```

On chains using the `Balances` pallet, `accountsStorage` will look _similar_ to the following.

```ts
{
  name: "Account",
  modifier: "Default",
  type: "Map",
  hashers: [ "Blake2_128Concat" ],
  key: {
    id: 0,
    path: [ "sp_core", "crypto", "AccountId32" ],
    params: [],
    type: "Struct",
    fields: [ { name: undefined, ty: [ ... ], typeName: "[u8; 32]", docs: [ ... ] } ],
    docs: []
  },
  value: {
    id: 5,
    path: [ "pallet_balances", "AccountData" ],
    params: [ { name: "Balance", ty: [ ... ] } ],
    type: "Struct",
    fields: [
      { name: "free", ty: [ ... ], typeName: "Balance", docs: [ ... ] },
      { name: "reserved", ty: [ ... ], typeName: "Balance", docs: [ ... ] },
      { name: "misc_frozen", ty: [ ... ], typeName: "Balance", docs: [ ... ] },
      { name: "fee_frozen", ty: [ ... ], typeName: "Balance", docs: [ ... ] }
    ],
    docs: []
  },
  default: Uint8Array(64) [ 0, 0, 0, ... ],
  docs: [ ... ]
}
```

- `type` tells us that this storage is that of a map, not a plain entry (standalone value)
- `key` tells us what type of value(s) we need to use in order to index into the map
- `value` tells us what type of value we can expect to retrieve from the map

In this example, the `key`'s `id` is `0`. Let's take a look at this type (within the top-level `metadata`'s `tys`).

```ts
const keyType = metadata.tys[accountsStorage.key]
```

`keyType` should evaluate to something along the lines of:

```ts
{
  i: 0,
  path: ["sp_core", "crypto", "AccountId32"],
  params: [],
  type: "Struct",
  fields: [{ name: undefined, ty: 1, typeName: "[u8; 32]", docs: [] }],
  docs: [],
};
```

If we index again into `metadata.tys` with `1` (as specified in the first field), we'll see the inner types (in this case a 32-element tuple of `u8`s). From these descriptions, we can roughly deduce the JS equivalent.

```ts
namespace sp_core {
  export namespace crypto {
    export type AccountId32 = Uint8Array
  }
}
```

We can instantiate this as we would any other JS-land value.

```ts
const accountId32 = new Uint8Array(RAW_ADDR_BYTES)
```

We'll cover the TypeScript <-> Rust conversions more in depth [in a later section](#typescript---rust).

Let's now utilize our `accountId32` definition to read a balance.

```ts
// ...

const key = C.keyPageRead(client)("System", "Account", 1, [])
  .access(0)
  .access(0)

const account = C.entryRead(client)("System", "Account", [key])

const account = await account.run()
```

What value does this retrieve? How can we deduce this from the FRAME metadata?

We can do the same as before, but this time index into `metadata.tys` with the `accountsStorage.value`.

```ts
const valueType = metadata.tys[accountsStorage.value]
```

This should give us something along the following lines:

```ts
{
  i: 5,
  path: ["pallet_balances", "AccountData"],
  params: [{ name: "Balance", ty: 6 }],
  type: "Struct",
  fields: [
    { name: "free", ty: 6, typeName: "Balance", docs: [] },
    { name: "reserved", ty: 6, typeName: "Balance", docs: [] },
    { name: "misc_frozen", ty: 6, typeName: "Balance", docs: [] },
    { name: "fee_frozen", ty: 6, typeName: "Balance", docs: [] },
  ],
  docs: [],
};
```

When we follow type `6` (metadata.tys[6]), we see that it represents a `u128`. In TypeScript, this translates to a `bigint`. Therefore, the complete JS-land structure looks as follows.

```ts
namespace pallet_balances {
  export interface AccountData {
    free: bigint
    reserved: bigint
    miscFrozen: bigint
    feeFrozen: bigint
  }
}
```

> Note: we can ignore the `params` field of the `AccountData` metadata, as the type param is already applied to the field metadata.

## Rust ⬌ TypeScript

<!-- https://github.com/paritytech/capi/pull/73 -->

<table>
<tr>
<td><b>Rust</b></td><td><b>TypeScript</b></td>
</tr>
<tr>
<td>

```rs
type T0 = ();
type T1 = (A,);
type T2 = (A, B);
type T3 = Vec<u8>;
type T4 = [u8; n];
type T5 = Vec<A>;
type T6 = [A; n];
type T7 = Option<A>;
type T8 = Result<O, E>;

struct S0;
struct S1(A);
struct S2(A, B);
struct S3 { a: A };

enum E0 {
  A,
  B,
  C,
};

enum E1 {
  A,
  B(C),
  D(E, F),
  G { h: H },
};
```

</td>
<td>

```ts
type T0 = null
type T1 = A
type T2 = [A, B]
type T3 = Uint8Array
type T4 = Uint8Array & { length: n }
type T5 = A[]
type T6 = A[] & { length: n }
type T7 = A | undefined
type T8 = O | ChainError<E>

type S0 = null
type S1 = A
type S2 = [A, B]
type S3 = { a: A }

type E0 = "A" | "B" | "C"

type E1 =
  | { type: "A" }
  | { type: "B"; value: C }
  | { type: "D"; value: [E, F] }
  | { type: "G"; h: H }
```

</td>
</tr>
</table>

## Runtime Validation

What happens if we ever specify an invalid value to an untyped effect? Capi will return a validation error with a detailed description of the type incompatibility.

For instance, the aforementioned system accounts map is keyed with a `Uint8Array`. What happens if we try to key into it with `"HELLO T6"`?

```ts
const account = C.entryRead(client)("System", "Account", ["HELLO T6"])

console.log(await account.run())
```

This will produce the following error:

```ts
ScaleAssertError: !(value[0] instanceof Uint8Array)
    < ... stacktrace ... >
```

---

Let's look at the same example from before: reading some `AccountData`.

## Discriminating "Ok" from "Error"

```ts
const result = await C.entryRead(client)("System", "Account", [key]).run()
```

In this storage read example, `result` is typed as the successfully-retrieved value (container) unioned with all possible errors.

There are several ways to "unwrap" the inner `value`. The recommended path is to first check for and handle all possible errors, which may encapsulate error specific data (as do [SCALE](https://github.com/paritytech/scale-ts) validation errors).

```ts
if (account instanceof Error) {
  // Handle errors here.
} else {
  account.value // `unknown`
}
```
