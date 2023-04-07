import { _getDeploymentUrl } from "../server/capi.dev/delegator.ts"

const sha = Deno.env.get("CAPI_SHA")!

const deploymentPollInterval = 5_000

while (!(await _getDeploymentUrl(sha))) {
  await new Promise((r) => setTimeout(r, deploymentPollInterval))
}
