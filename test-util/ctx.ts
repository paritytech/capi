import { Config, config } from "./Config.ts";
import { node } from "./node.ts";

export async function ctx(use: (config: Config) => Promise<void>) {
  const node_ = await node();
  const config_ = config(node_);
  await use(config_);
  node_.close();
}
