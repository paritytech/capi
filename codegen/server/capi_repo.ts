import { PermanentMemo, TimedMemo } from "../../util/memo.ts"
import { shaAbbrevLength } from "./git_utils.ts"
import { CodegenServer } from "./server.ts"

const tagsTtl = 60_000 // 1 minute
const branchesTtl = 60_000 // 1 minute

export const githubApiRepo = "https://api.github.com/repos/paritytech/capi"

export abstract class CapiCodegenServer extends CodegenServer {
  rTagVersion = /^v?(\d+\.\d+\.\d+[^\/]*)$/
  rRefVersion = /^ref:([^\/]*)$/
  rShaVersion = /^sha:([0-9a-f]+)$/

  async normalizeVersion(version: string) {
    const tagMatch = this.rTagVersion.exec(version)
    if (tagMatch) return "v" + tagMatch[1]
    if (this.rRefVersion.test(version)) {
      const shaVersion = (await this.branches())[version]
      if (!shaVersion) throw this.e404()
      return shaVersion
    }
    const shaMatch = this.rShaVersion.exec(version)
    if (shaMatch) {
      const sha = await this.fullSha(shaMatch[1]!)
      return `sha:${sha.slice(0, shaAbbrevLength)}`
    }
    throw this.e404()
  }

  moduleFileUrl(version: string, path: string) {
    if (this.local && version === this.version) {
      return new URL("../.." + path, import.meta.url).toString()
    }
    if (this.rRefVersion.test(version)) {
      return `https://deno.land/x/capi@${version}${path}`
    }
    const shaMatch = this.rShaVersion.exec(version)
    if (shaMatch) {
      const [, sha] = shaMatch
      return `https://raw.githubusercontent.com/paritytech/capi/${sha}${path}`
    }
    throw new Error("expected normalized version")
  }

  async versionSuggestions(): Promise<string[]> {
    return (await Promise.all([
      this.local ? ["local"] : [],
      this.tags(),
      this.branches().then(Object.keys),
    ])).flat()
  }

  tagsMemo = new TimedMemo<null, string[]>(tagsTtl, this.abortController.signal)
  tags() {
    return this.tagsMemo.run(null, async () => {
      return (await json("https://apiland.deno.dev/completions/items/capi/")).items
    })
  }

  branchesMemo = new TimedMemo<null, Record<string, string>>(
    branchesTtl,
    this.abortController.signal,
  )
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

  fullShaMemo = new PermanentMemo<string, string>()
  fullSha(sha: string) {
    return this.fullShaMemo.run(sha, async () => {
      return (await json(`${githubApiRepo}/commits/${sha}`)).sha
    })
  }
}

export async function json(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: invalid response`)
  return await response.json()
}

export interface GithubRef {
  ref: string
  object: { sha: string }
}
