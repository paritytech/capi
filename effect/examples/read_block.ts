import * as C from "../../mod.ts";
import * as U from "../../util/mod.ts";

const root = C.readBlock(C.polkadot);

console.log(U.throwIfError(await root.run()));
