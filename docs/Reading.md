# Reading

```ts
import * as chain from "./generated.ts";
```

## Items

```ts
const result = await chain.timestamp.now.read();
```

## Maps

```ts
const result = await chain.system.account.get(PUBLIC_KEY).read();
```

## NMaps

```ts
const result = await chain.staking.nominatorSlashInEra.get(123, PUBLIC_KEY).read();
```

### Keys

```ts
const keyPage = await.chain.staking.nominatorSlashInEra.keys(5).read()
```

## Child Trie

TODO
