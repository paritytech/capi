import * as t from "../test-util/mod.ts";
import { metadata, rpcClient } from "./atoms/mod.ts";
import { run } from "./run.ts";

const node = await t.node();
const client = rpcClient(t.config(node));
const metadata_ = metadata(client);
const result = await run(metadata_);
if (result instanceof Error) {
  throw result;
}
console.log(result);
node.close();
