import { polkadot } from "../known/mod.ts";
import { metadata, rpcClient } from "./atoms/mod.ts";
import { run } from "./run.ts";

const client = rpcClient(polkadot);
const metadata_ = metadata(client);
const result = await run(metadata_);
if (result instanceof Error) {
  throw result;
}
// console.log(result);
