import * as t from "../test-util/mod.ts";
import { run } from "./run.ts";
import { read } from "./std/read.ts";

const node = await t.node();
const config = t.config(node);
const read_ = read(config, "System", "Account", [t.pairs.alice.public]);
const result = await run(read_);
node.close();
console.log(result);
