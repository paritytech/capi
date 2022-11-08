import * as C from "../mod.ts";
import * as T from "../test_util/mod.ts";
import * as U from "../util/mod.ts";

const root = C.palletMetadata(C.metadata(T.polkadot)(), "System");

console.log(U.throwIfError(await root.run()));
