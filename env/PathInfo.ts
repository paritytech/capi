import * as U from "../util/mod.ts"

export interface PathInfo {
  vCapi?: string
  providerId: string
  target: string
  vRuntime?: string
  filePath?: string
  targetKey: string
}

export function parsePathInfo(src: string): PathInfo {
  let vCapi: string | undefined
  let target: string
  let vRuntime: string | undefined
  let filePath: string | undefined
  let targetKey: string
  let vCapiTail = src
  if (src[0] === "@") {
    const vCapiAndTail = U.splitFirst("/", src.slice(1))
    if (!vCapiAndTail) throw new Error()
    vCapi = vCapiAndTail[0]
    vCapiTail = vCapiAndTail[1]
  }
  const providerIdAndTail = U.splitFirst(":", vCapiTail)
  if (!providerIdAndTail) throw new Error()
  const providerId = providerIdAndTail[0]
  const [, providerIdTail] = providerIdAndTail
  const targetAndTail = U.splitFirst("@", providerIdTail)
  if (targetAndTail) {
    target = targetAndTail[0]
    const [, targetTail] = targetAndTail
    const versionAndFilePath = U.splitFirst("/", targetTail)
    if (versionAndFilePath) {
      ;[vRuntime, filePath] = versionAndFilePath
    } else {
      vRuntime = targetTail
    }
  } else {
    target = providerIdTail
  }
  targetKey = `${providerId}:${target}`
  if (vRuntime) targetKey += `@${vRuntime}`
  return { vCapi, providerId, target, vRuntime, filePath, targetKey }
}

export function assertVRuntime(
  pathInfo: PathInfo,
  version?: string,
): asserts pathInfo is PathInfo & { vRuntime: string } {
  if (!pathInfo.vRuntime) throw new Error()
  if (version && version !== pathInfo.vRuntime) throw new Error()
}

export function assertFilePath(
  pathInfo: PathInfo,
): asserts pathInfo is PathInfo & { filePath: string } {
  if (!pathInfo.filePath) throw new Error()
}
