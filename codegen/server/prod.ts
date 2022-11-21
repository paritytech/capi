import { PermanentMemo, TimedMemo } from "../../util/memo.ts"
import { S3Cache } from "./s3.ts"
import { CodegenServer } from "./server.ts"

export const shaAbbrevLength = 8

const denoDeployUserId = 75045203

const tagsTtl = 60_000 // 1 minute
const branchesTtl = 60_000 // 1 minute

const productionHost = "capi.dev"

const githubApiRepo = "https://api.github.com/repos/paritytech/capi"

export class ProdCodegenServer extends CodegenServer {
  moduleIndex
  cache = new S3Cache({
    accessKeyID: Deno.env.get("S3_ACCESS_KEY")!,
    secretKey: Deno.env.get("S3_SECRET_KEY")!,
    region: Deno.env.get("S3_REGION")!,
    bucket: Deno.env.get("S3_BUCKET")!,
  })
  localChainSupport = false

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

  async delegateRequest(request: Request, version: string, path: string): Promise<Response> {
    const normalizedVersion = await this.normalizeVersion(version)
    if (normalizedVersion !== version) {
      return this.redirect(`/@${normalizedVersion}${path}`)
    }
    const sha = await this.versionSha(version)
    const url = await this.deploymentUrl(sha)
    return await fetch(new URL(new URL(request.url).pathname, url), {
      headers: request.headers,
    })
  }

  async versionSha(version: string) {
    if (ProdCodegenServer.rRefVersion.test(version)) {
      return this.tagSha(version)
    }
    const shaMatch = ProdCodegenServer.rShaVersion.exec(version)
    if (shaMatch) {
      return await this.fullSha(shaMatch[1]!)
    }
    throw new Error("expected normalized version")
  }

  static rTagVersion = /^v?(\d+\.\d+\.\d+[^\/]*)$/
  static rRefVersion = /^ref:([^\/]*)$/
  static rShaVersion = /^sha:([0-9a-f]+)$/
  async normalizeVersion(version: string) {
    const tagMatch = ProdCodegenServer.rTagVersion.exec(version)
    if (tagMatch) return "v" + tagMatch[1]
    if (ProdCodegenServer.rRefVersion.test(version)) {
      return (await this.branches())[version]
    }
    const shaMatch = ProdCodegenServer.rShaVersion.exec(version)
    if (shaMatch) {
      const sha = await this.fullSha(shaMatch[1]!)
      return `sha:${sha.slice(0, shaAbbrevLength)}`
    }
    throw this.e404()
  }

  async moduleFile(request: Request, path: string): Promise<Response> {
    if (ProdCodegenServer.rRefVersion.test(this.version)) {
      return this.redirect(`https://deno.land/x/capi@${this.version}${path}`)
    }
    const sha = await this.versionSha(this.version)
    const res = await fetch(`https://raw.githubusercontent.com/paritytech/capi/${sha}${path}`)
    if (!res.ok) return this.e404()
    return this.ts(request, await res.text())
  }

  async versionSuggestions(): Promise<string[]> {
    return (await Promise.all([
      this.tags(),
      this.branches().then(Object.keys),
    ])).flat()
  }

  tagsMemo = new TimedMemo<null, string[]>(tagsTtl)
  tags() {
    return this.tagsMemo.run(null, async () => {
      return (await json("https://apiland.deno.dev/completions/items/capi/")).items
    })
  }

  branchesMemo = new TimedMemo<null, Record<string, string>>(branchesTtl)
  branches() {
    return this.branchesMemo.run(null, async () => {
      const refs: GithubRef[] = await json(
        `${githubApiRepo}/git/matching-refs/heads`,
      )
      return Object.fromEntries(refs.map((ref) => [
        `ref:${ref.ref.slice("refs/heads/".length).replace(/\//g, ":")}`,
        `sha:${ref.object.sha.slice(0, shaAbbrevLength)}`,
      ]))
    })
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

  fullShaMemo = new PermanentMemo<string, string>()
  fullSha(sha: string) {
    return this.fullShaMemo.run(sha, async () => {
      return (await json(`${githubApiRepo}/commits/${sha}`)).sha
    })
  }

  deploymentUrlMemo = new PermanentMemo<string, string>()
  deploymentUrl(fullSha: string) {
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
}

async function json(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: invalid response`)
  return await response.json()
}

interface GithubRef {
  ref: string
  object: { sha: string }
}

interface GithubDeployment {
  creator: { id: number }
  statuses_url: string
}

interface GithubStatus {
  environment_url?: string
}
