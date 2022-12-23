import { PermanentMemo } from "../util/memo.ts"
import { CapiCodegenServer, GITHUB_API_REPO, json } from "./capi_repo.ts"
import { S3Cache } from "./s3.ts"

const DENO_DEPLOY_USER_ID = 75045203

const PRODUCTION_HOST = "capi.dev"

export class DenoDeployCodegenServer extends CapiCodegenServer {
  moduleIndex
  cache = new S3Cache({
    accessKeyID: Deno.env.get("S3_ACCESS_KEY")!,
    secretKey: Deno.env.get("S3_SECRET_KEY")!,
    region: Deno.env.get("S3_REGION")!,
    bucket: Deno.env.get("S3_BUCKET")!,
  }, this.abortController.signal)
  local = false

  constructor(readonly mainVersion: string, moduleIndex: string[]) {
    super()
    this.moduleIndex = () => Promise.resolve(moduleIndex)
  }

  async defaultVersion(request: Request) {
    if (new URL(request.url).host === PRODUCTION_HOST) {
      return (await this.tags())[0]!
    }
    return this.mainVersion
  }

  deploymentUrlMemo = new PermanentMemo<string, string>()
  async deploymentUrl(version: string) {
    const fullSha = await this.versionFullSha(version)
    return this.deploymentUrlMemo.run(fullSha, async () => {
      const deployments: GithubDeployment[] = await json(
        `${GITHUB_API_REPO}/deployments?sha=${fullSha}`,
      )
      const deployment = deployments.find((x) => x.creator.id === DENO_DEPLOY_USER_ID)
      if (!deployment) throw this.e404()
      const statuses: GithubStatus[] = await json(deployment.statuses_url)
      const url = statuses.map((x) => x.environment_url).find((x) => x)
      if (!url) throw this.e404()
      return url
    })
  }
}

interface GithubDeployment {
  creator: { id: number }
  statuses_url: string
}

interface GithubStatus {
  environment_url?: string
}
