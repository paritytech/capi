# Dynamic DX

First, let's assume these constants are defined and in scope:

```ts
declare const WS_RPC_PROXY_URL: string; // <-- you define this
declare const PUB_KEY_BYTES: string; // <-- ... and this
```

Next, let's make use of them and Capi.

```ts
import * as frame from "/frame/mod.ts";
import * as sys from "/system/mod.ts";

// Bind to a specific chain via a proxy URL
const chain = frame.Chain.ProxyWebSocketUrl(sys.lift(WS_RPC_PROXY_URL));

// Bind to a specific storage entry of the chain (in this case, a map)
const storageEntry = frame.StorageEntry(chain, "System", "Account");

// Bind to a value of the storage entry map
const storageMapValue = frame.StorageMapValue(storageEntry, sys.lift(PUB_KEY_BYTES));

// Initiate the request
const result = await sys.Fiber(storageMapValue, sys.webSocketConnectionPool(), {}).run();
```

Although this is the current state of effect execution, the dynamic DX will not involve direct instantiation / running of fibers.

> NOTE: we can't yet even call the result of `sys.Fiber` a "Fiber," as suspension / resuming is not implemented.

**While not yet fully-implemented**, the DX will eventually look as follows.

```ts
import * as frame from "/frame/mod.ts";
import * as sys from "/system/mod.ts";

// Create a shared container for inflight requests, caches, etc.
const exec = sys.exec();

// Bind to a specific chain via a proxy URL
const chain = frame.Chain.ProxyWebSocketUrl(sys.lift(WS_RPC_PROXY_URL));

// Bind to a specific storage entry of the chain (in this case, a map)
const storageEntry = frame.StorageEntry(chain, "System", "Account");

// Bind to a value of the storage entry map
const storageMapValue = frame.StorageMapValue(storageEntry, sys.lift(PUB_KEY_BYTES));

// Initiate the request
const result = await exec(storageMapValue);
```
