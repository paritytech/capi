import { PermanentMemo } from "../../util/memo.ts"
import { CapiCodegenServer, githubApiRepo, GithubRef, json } from "./capi_repo.ts"
import { S3Cache } from "./s3.ts"

export const shaAbbrevLength = 8

const denoDeployUserId = 75045203

const productionHost = "capi.dev"

export class DenoDeployCodegenServer extends CapiCodegenServer {
  moduleIndex
  cache = new S3Cache({
    accessKeyID: Deno.env.get("S3_ACCESS_KEY")!,
    secretKey: Deno.env.get("S3_SECRET_KEY")!,
    region: Deno.env.get("S3_REGION")!,
    bucket: Deno.env.get("S3_BUCKET")!,
  }, this.abortController.signal)
  local = false

  constructor(readonly version: string, moduleIndex: string[]) {
    super()
    this.moduleIndex = async () => moduleIndex
  }

  async defaultVersion(request: Request) {
    if (new URL(request.url).host === productionHost) {
      return (await this.tags())[0]!
    }
    return this.version
  }

  deploymentUrlMemo = new PermanentMemo<string, string>()
  async deploymentUrl(version: string) {
    const fullSha = await this.versionSha(version)
    return this.deploymentUrlMemo.run(fullSha, async () => {
      const deployments: GithubDeployment[] = await json(
        `${githubApiRepo}/deployments?sha=${fullSha}`,
      )
      const deployment = deployments.find((x) => x.creator.id === denoDeployUserId)
      if (!deployment) throw this.e404()
      const statuses: GithubStatus[] = await json(deployment.statuses_url)
      const url = statuses.map((x) => x.environment_url).find((x) => x)
      if (!url) throw this.e404()
      return url
    })
  }

  async versionSha(version: string) {
    if (this.rRefVersion.test(version)) {
      return this.tagSha(version)
    }
    const shaMatch = this.rShaVersion.exec(version)
    if (shaMatch) {
      return await this.fullSha(shaMatch[1]!)
    }
    throw new Error("expected normalized version")
  }

  tagShaMemo = new PermanentMemo<string, string>()
  tagSha(tag: string) {
    return this.fullShaMemo.run(tag, async () => {
      const refs: GithubRef[] = await json(
        `${githubApiRepo}/git/matching-refs/tags/${tag}`,
      )
      if (!refs[0]) throw this.e404()
      return refs[0].object.sha
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
