import { delay } from "../deps/std/async.ts"
import { _getDeploymentUrl } from "../server/capi.dev/delegator.ts"

console.log("Running await deployment")

const sha = Deno.env.get("CAPI_SHA")!

console.log("Sha:", sha)

const deploymentPollInterval = 5_000

while (!(await _getDeploymentUrl(sha))) {
  console.log("Polling")
  await delay(deploymentPollInterval)
}
