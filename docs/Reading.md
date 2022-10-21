# Reading

```ts
import * as frame from "./generated/frame.ts";
```

## Items

```ts
const result = await chain.timestamp.now;
```

## Maps

```ts
const result = await chain.system.account.get(PUBLIC_KEY);
```

## NMaps

```ts
const result = await chain.staking.nominatorSlashInEra.get(123, PUBLIC_KEY);
```

### Keys

```ts
const keyPage = await.chain.staking.nominatorSlashInEra.keys(5)
```

## Child Trie

TODO
