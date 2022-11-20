import { TimedMemo } from "../../util/memo.ts"
import { S3Cache } from "./s3.ts"
import { CodegenServer } from "./server.ts"

const shaAbbrevLength = 8

const denoDeployId = 75045203

export class ProdCodegenServer extends CodegenServer {
  modIndex
  cache = new S3Cache({
    accessKeyID: Deno.env.get("S3_ACCESS_KEY")!,
    secretKey: Deno.env.get("S3_SECRET_KEY")!,
    region: Deno.env.get("S3_REGION")!,
    bucket: Deno.env.get("S3_BUCKET")!,
  })

  constructor(readonly version: string, modIndex: string[]) {
    super()
    this.modIndex = Promise.resolve(modIndex)
  }

  async getDefaultVersion() {
    return (await this.tags())[0]!
  }

  async handleModRequest(request: Request, path: string): Promise<Response> {
    if (this.version.startsWith("v")) {
      return this.redirect(`https://deno.land/x/capi@${this.version}${path}`)
    } else if (this.version.startsWith("sha:")) {
      const res = await fetch(
        `https://raw.githubusercontent.com/paritytech/capi/${await this.getFullSha(
          this.version.slice("sha:".length),
        )}${path}`,
      )
      if (!res.ok) return this.e404()
      return this.ts(request, await res.text())
    }
    throw new Error("invalid this.version")
  }

  async delegateRequest(request: Request, version: string, path: string): Promise<Response> {
    const normalizedVersion = await this.normalizeVersion(version)
    console.log(version, normalizedVersion)
    if (!normalizedVersion) return this.e404()
    if (normalizedVersion !== version) {
      return this.redirect(`/@${normalizedVersion}${path}`)
    }
    const sha = normalizedVersion.startsWith("sha:")
      ? await this.getFullSha(version.slice("sha:".length))
      : await this.getTagSha(normalizedVersion)
    const url = await this.getDeploymentUrl(sha)
    return await fetch(new URL(new URL(request.url).pathname, url))
  }

  async getVersionSuggestions(): Promise<string[]> {
    return (await Promise.all([
      this.tags(),
      this.branches().then((x) => x.map((x) => x[0])),
    ])).flat()
  }

  tagsMemo = new TimedMemo<null, string[]>(60000)
  tags() {
    return this.tagsMemo.run(null, async () => {
      return (await fetch("https://apiland.deno.dev/completions/items/capi/").then((r) => r.json()))
        .items
    })
  }

  branchesMemo = new TimedMemo<null, [branch: string, sha: string][]>(60000)
  branches() {
    return this.branchesMemo.run(null, async () => {
      const refs = await json(
        "https://api.github.com/repos/paritytech/capi/git/matching-refs/heads",
      )
      return refs.map((
        ref: any,
      ) => [
        "ref:" + ref.ref.slice("refs/heads/".length).replace(/\//g, ":"),
        `sha:${ref.object.sha.slice(0, shaAbbrevLength)}`,
      ])
    })
  }

  getTagShaMemo = new TimedMemo<string, string>(60000)
  getTagSha(tag: string) {
    return this.getFullShaMemo.run(tag, async () => {
      const refs = await json(
        `https://api.github.com/repos/paritytech/capi/git/matching-refs/tags/${tag}`,
      )
      return refs[0].object.sha
    })
  }

  async normalizeVersion(version: string) {
    if (/^\d+\.\d+\.\d+/.test(version)) return "v" + version
    if (version.startsWith("ref:")) {
      return (await this.branches()).find((b) => b[0] === version)?.[1]
    }
    if (/^sha:[0-9a-f]+$/.test(version)) {
      const sha = version.slice("sha:".length)
      if (sha.length > shaAbbrevLength) {
        return version.slice(0, "sha:".length + shaAbbrevLength)
      } else if (sha.length < shaAbbrevLength) {
        return "sha:" + (await this.getFullSha(sha)).slice(0, shaAbbrevLength)
      } else {
        return version
      }
    }
    return undefined
  }

  getFullShaMemo = new TimedMemo<string, string>(60000)
  getFullSha(sha: string) {
    return this.getFullShaMemo.run(sha, async () => {
      return (await json(`https://api.github.com/repos/paritytech/capi/commits/${sha}`)).sha
    })
  }

  deploymentUrlMemo = new TimedMemo<string, string>(60000)
  getDeploymentUrl(fullSha: string) {
    return this.deploymentUrlMemo.run(fullSha, async () => {
      const deployments = await json(
        `https://api.github.com/repos/paritytech/capi/deployments?sha=${fullSha}`,
      )
      const deployment = deployments.find((x: any) => x.creator.id === denoDeployId)
      const statuses = await json(deployment.statuses_url)
      const url = statuses.map((x: any) => x.environment_url).find((x: any) => x)
      if (!url) throw this.e404()
      return url
    })
  }
}

async function json(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error("invalid response")
  return await response.json()
}
