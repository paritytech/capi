import * as C from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import * as Z from "../mod.ts";

const read_ = Z.readBlock(C.polkadot);
const result = U.throwIfError(await Z.run(read_));
console.log(result.block);
