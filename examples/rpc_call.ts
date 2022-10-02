import * as C from "../mod.ts";
import * as U from "../util/mod.ts";

const root = C.rpcCall(C.polkadot, "rpc_methods", []);

console.log(U.throwIfError(await root.run()));
