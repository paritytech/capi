export interface PathInfo {
  src: string
  vCapi?: string
  generatorId: string
  providerId: string
  target: string
  vRuntime?: string
  filePath?: string
}

const rPathInfo =
  /^(@(?<vCapi>.+?)\/)?(?<generatorId>.+?)\/(?<providerId>.+?)\/(?<target>.+?)(\/@(?<vRuntime>.+?)(\/(?<filePath>.+))?)?$/

export function parsePathInfo(src: string): PathInfo | undefined {
  return rPathInfo.exec(src)?.groups as PathInfo | undefined
}

export function fromPathInfo(
  vCapi: string | undefined,
  generatorId: string,
  providerId: string,
  target: string,
  vRuntime?: string,
  filePath?: string,
): string {
  let src = [...vCapi ? [vCapi] : [], generatorId, providerId, target].join("/")
  vRuntime && (src += "/@" + vRuntime)
  filePath && (src += "/" + filePath)
  return src
}
