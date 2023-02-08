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
  /^\/(@(?<vCapi>.+?)\/)?(?<generatorId>.+?)\/(?<providerId>.+?)\/(?<target>.+?)(\/@(?<vRuntime>.+?)(\/(?<filePath>.*))?)?$/

export function parsePathInfo(src: string): PathInfo | undefined {
  return rPathInfo.exec(src)?.groups as PathInfo | undefined
}

export function fromPathInfo(
  { vCapi, generatorId, providerId, target, vRuntime, filePath }: PathInfo,
): string {
  let src = vCapi ? `/@${vCapi}/` : "/"
  src += [generatorId, providerId, target].join("/")
  if (vRuntime) src += `/@${vRuntime}`
  if (filePath) src += `/${filePath}`
  return src
}
