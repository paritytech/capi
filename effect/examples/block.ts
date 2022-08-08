import * as C from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import * as Z from "../mod.ts";

const read = Z.readBlock(C.polkadot);
const result = U.throwIfError(await read.run());
console.log(result.block);
