import { config } from "./config.ts";
import { node } from "./node.ts";

export async function ctx(use: (config_: ReturnType<typeof config>) => Promise<void>) {
  const node_ = await node();
  await use(config(node_));
  node_.close();
}
