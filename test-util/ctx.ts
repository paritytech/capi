import { config } from "./config.ts";
import { node, TestNodeConfig } from "./node.ts";

// TODO: generic over config
export async function ctx(
  use: (config_: ReturnType<typeof config>) => Promise<void>,
  nodeConfig?: TestNodeConfig,
) {
  const node_ = await node(nodeConfig);
  await use(config(node_));
  node_.close();
}
