import * as t from "../test-util/mod.ts";
import { metadata } from "./atoms/Metadata.ts";
import { run } from "./run.ts";

const node = await t.node();
const config = t.config(node);
const metadata_ = metadata(config);
const result = await run(metadata_);
node.close();
console.log(result);
