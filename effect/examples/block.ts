import * as C from "../../known/mod.ts";
import * as U from "../../util/mod.ts";
import { run } from "../run.ts";
import { readBlock } from "../std/block/read.ts";

const read_ = readBlock(C.polkadot);
const result = U.throwIfError(await run(read_));
console.log(result.block);
