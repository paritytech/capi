import { LaunchConfig, start } from "npm:@zombienet/orchestrator"

const [config, options] = JSON.parse(Deno.args[0]!) as [LaunchConfig, Parameters<typeof start>[2]]

const network = await start("", config, options)

const lookup = Object.fromEntries(
  Object.entries(network.nodesByName).map(([name, node]) => [name, node.wsUri]),
)

console.log(`capi_network = ${JSON.stringify(lookup)}`)
