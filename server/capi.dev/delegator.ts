import { serve } from "../../deps/std/http.ts"
import { TimedMemo } from "../../util/memo.ts"
import { f, handleCors, handleErrors } from "../mod.ts"

serve(handleCors(handleErrors(handler)))

const ttl = 60_000
const shaAbbrevLength = 8

const rTagVersion = /^v(\d+\.\d+\.\d+(?:-.+)?)$/
const rPrVersion = /^pr:(\d+)$/
const rVersionedUrl = /^(?:\/@(.+?))?(\/.*)?$/

const delegateeProjectId = "70eddd08-c9b0-4cb3-b100-8c6facf52f1e"
const githubApiBase = "https://api.github.com/repos/paritytech/capi/"

const { signal } = new AbortController()

async function handler(request: Request) {
  const url = new URL(request.url)
  const [, version, path = "/"] = rVersionedUrl.exec(url.pathname)!
  if (!version) return f.redirect(`/@${await defaultVersion()}${path}`)
  const sha = await getSha(version)
  let normalizedVersion
  if (rTagVersion.test(version)) {
    normalizedVersion = version.replace(rTagVersion, "v$1")
  } else {
    normalizedVersion = sha.slice(0, shaAbbrevLength)
  }
  if (version !== normalizedVersion) {
    return f.redirect(`/@${normalizedVersion}${path}`)
  }
  const deploymentUrl = await getDeployment(sha)
  return await fetch(new URL(path, deploymentUrl), {
    method: request.method,
    headers: request.headers,
    body: request.body,
  })
}

const defaultVersionMemo = new TimedMemo<void, string>(ttl, signal)
async function defaultVersion() {
  return await defaultVersionMemo.run(undefined, async () => {
    const release = await github<GithubRelease>(`releases/latest`).catch(async () =>
      (await github<GithubRelease[]>(`releases`))[0]!
    )
    return release.tag_name
  })
}

const shaMemo = new TimedMemo<string, string>(ttl, signal)
async function getSha(version: string): Promise<string> {
  const ref = version
    .replace(rPrVersion, "pull/$1/head")
    .replace(rTagVersion, "v$1")
    .replace(/:/g, "/")
  return await shaMemo.run(
    ref,
    async () => (await github<GithubCommit>(`commits/${ref}`)).sha,
  )
}

const deploymentMemo = new TimedMemo<string, string>(ttl, signal)
async function getDeployment(sha: string) {
  return await deploymentMemo.run(sha, async () => {
    const deployments = await github<GithubDeployment[]>(`deployments?sha=${sha}`)
    const deployment = deployments.find((x) => x.payload.project_id === delegateeProjectId)
    if (!deployment) throw f.notFound()
    const statuses = await github<GithubStatus[]>(deployment.statuses_url)
    const url = statuses.map((x) => x.environment_url).find((x) => x)
    if (!url) throw f.notFound()
    return url
  })
}

async function github<T>(url: string): Promise<T> {
  const response = await fetch(new URL(url, githubApiBase))
  if (!response.ok) throw new Error(`${url}: invalid response`)
  return await response.json()
}

interface GithubDeployment {
  statuses_url: string
  payload: { project_id: string }
}

interface GithubStatus {
  environment_url?: string
}

interface GithubRelease {
  tag_name: string
}

interface GithubCommit {
  sha: string
}
