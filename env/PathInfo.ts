import * as U from "../util/mod.ts"

export interface PathInfo {
  vCapi?: string
  generatorId: string
  providerId: string
  target: string
  vRuntime?: string
  filePath?: string
  cacheKey: string
}

export function parsePathInfo(src: string): PathInfo | undefined {
  const tmp: Partial<PathInfo> = {}
  const tails: [string, string?, string?] = [src]
  if (src[0] === "@") {
    const a = U.splitFirst("/", src.slice(1))
    if (a) [tmp.vCapi, tails[0]] = a
    else return
  }
  const b = U.splitFirst("/", tails[0])
  if (b) {
    ;[tmp.generatorId, tails[1]] = b
    const c = U.splitFirst("/", tails[1])
    if (c) {
      ;[tmp.providerId, tails[2]] = c
      const d = U.splitFirst("@", tails[2])
      if (d) {
        tmp.target = d[0].slice(0, d[0].length - 1)
        const e = U.splitFirst("/", d[1])
        if (e) {
          ;[tmp.vRuntime, tmp.filePath] = e
          tmp.cacheKey = tails[1].slice(0, tails[1].length - tmp.filePath.length - 1)
        } else {
          tmp.vRuntime = d[1]
          tmp.cacheKey = tails[1]
        }
      } else {
        tmp.target = tails[2]
        tmp.cacheKey = tails[1]
      }
    }
  }
  return isPathInfo(tmp) ? tmp : undefined
}

export function isPathInfo(inQuestion: object): inQuestion is PathInfo {
  return !!("generatorId" in inQuestion && typeof inQuestion.generatorId === "string"
    && "providerId" in inQuestion && typeof inQuestion.providerId === "string"
    && "target" in inQuestion && typeof inQuestion.target === "string"
    && "cacheKey" in inQuestion && typeof inQuestion.cacheKey === "string")
}

export function assertVRuntime(
  pathInfo: PathInfo,
  version?: string,
): asserts pathInfo is PathInfo & { vRuntime: string } {
  if (!pathInfo.vRuntime) throw new Error("No `vRuntime` in `pathInfo`")
  if (version && version !== pathInfo.vRuntime) {
    throw new Error("`vRuntime` different from expected")
  }
}

export function assertFilePath(
  pathInfo: PathInfo,
): asserts pathInfo is PathInfo & { filePath: string } {
  if (!pathInfo.filePath) throw new Error("No `filePath` in `pathInfo`")
}
