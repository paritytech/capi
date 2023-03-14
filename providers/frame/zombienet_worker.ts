import { LaunchConfig, start } from "npm:@zombienet/orchestrator"

const [config, options] = JSON.parse(Deno.args[0]!) as [LaunchConfig, Parameters<typeof start>[2]]

const network = await start("", config, options)

console.log(`capi_network = ${JSON.stringify(network)}`)
