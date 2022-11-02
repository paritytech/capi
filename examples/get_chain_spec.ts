import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

await T.polkadot.discoveryValue;

const root = C.palletMetadata(C.metadata(T.polkadot), "System");
// const root = C.rpcCall(T.polkadot, "sync_state_genSyncSpec", [true]);

console.log(U.throwIfError(await C.run(root)));
