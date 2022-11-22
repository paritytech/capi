import { PermanentMemo, TimedMemo } from "../../util/memo.ts"
import { SHA_ABBREV_LENGTH } from "./git_utils.ts"
import { CodegenServer } from "./server.ts"

const TAGS_TTL = 60_000 // 1 minute
const BRANCHES_TTL = 60_000 // 1 minute

export const GITHUB_API_REPO = "https://api.github.com/repos/paritytech/capi"

export const R_TAG_VERSION = /^v?(\d+\.\d+\.\d+[^\/]*)$/
export const R_REF_VERSION = /^ref:([^\/]*)$/
export const R_SHA_VERSION = /^sha:([0-9a-f]+)$/

export abstract class CapiCodegenServer extends CodegenServer {
  async normalizeVersion(version: string) {
    const tagMatch = R_TAG_VERSION.exec(version)
    if (tagMatch) return "v" + tagMatch[1]
    if (R_REF_VERSION.test(version)) {
      const shaVersion = (await this.branches())[version]
      if (!shaVersion) throw this.e404()
      return shaVersion
    }
    const shaMatch = R_SHA_VERSION.exec(version)
    if (shaMatch) {
      const sha = await this.fullSha(shaMatch[1]!)
      return `sha:${sha.slice(0, SHA_ABBREV_LENGTH)}`
    }
    throw this.e404()
  }

  moduleFileUrl(version: string, path: string) {
    if (this.local && version === this.version) {
      return new URL("../.." + path, import.meta.url).toString()
    }
    if (R_REF_VERSION.test(version)) {
      return `https://deno.land/x/capi@${version}${path}`
    }
    const shaMatch = R_SHA_VERSION.exec(version)
    if (shaMatch) {
      const [, sha] = shaMatch
      return `https://raw.githubusercontent.com/paritytech/capi/${sha}${path}`
    }
    throw new Error("expected normalized version")
  }

  async versionSuggestions(): Promise<string[]> {
    return [
      ...new Set((await Promise.all([
        this.local ? [this.version] : [],
        this.tags(),
        this.branches().then(Object.keys),
      ])).flat()),
    ]
  }

  tagsMemo = new TimedMemo<null, string[]>(TAGS_TTL, this.abortController.signal)
  tags() {
    return this.tagsMemo.run(null, async () => {
      return (await json("https://apiland.deno.dev/completions/items/capi/")).items
    })
  }

  branchesMemo = new TimedMemo<null, Record<string, string>>(
    BRANCHES_TTL,
    this.abortController.signal,
  )
  branches() {
    return this.branchesMemo.run(null, async () => {
      const refs: GithubRef[] = await json(
        `${GITHUB_API_REPO}/git/matching-refs/heads`,
      )
      return Object.fromEntries(refs.map((ref) => [
        `ref:${ref.ref.slice("refs/heads/".length).replace(/\//g, ":")}`,
        `sha:${ref.object.sha.slice(0, SHA_ABBREV_LENGTH)}`,
      ]))
    })
  }

  fullShaMemo = new PermanentMemo<string, string>()
  fullSha(sha: string) {
    return this.fullShaMemo.run(sha, async () => {
      return (await json(`${GITHUB_API_REPO}/commits/${sha}`)).sha
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