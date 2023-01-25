import * as U from "../util/mod.ts"

export interface PathInfo {
  src: string
  vCapi?: string
  generatorId: string
  providerId: string
  target: string
  vRuntime?: string
  filePath?: string
}

export function parsePathInfo(src: string): PathInfo | undefined {
  const tmp: Partial<PathInfo> = { src }
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
        } else {
          tmp.vRuntime = d[1]
        }
      } else {
        tmp.target = tails[2]
      }
    }
  }
  return isPathInfo(tmp) ? tmp : undefined
}

export function isPathInfo(inQuestion: object): inQuestion is PathInfo {
  return !!("generatorId" in inQuestion && typeof inQuestion.generatorId === "string"
    && "providerId" in inQuestion && typeof inQuestion.providerId === "string"
    && "target" in inQuestion && typeof inQuestion.target === "string")
}
