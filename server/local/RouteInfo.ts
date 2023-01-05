import { ValueOf } from "../../util/mod.ts"

interface Compass {
  type: string
  uri: string
  version: string
}

export type RouteInfo = ValueOf<RouteInfoLookup>
export type RouteInfoLookup = EnsureRouteInfoLookup<{
  LandingPage: {}
  IntellisenseManifest: {}
  FrameCompassTypeCompletions: {}
  FrameCompassUriCompletions: {
    compassType: string
  }
  FrameCompassVersionCompletions: {
    compassType: string
    compassUri: string
  }
  FrameChainTsCompletions: {
    compass: Compass
  }
  FrameChainTs: {
    compass: Compass
    path: string
  }
  Other: {}
}>
type EnsureRouteInfoLookup<T extends Record<string, Record<string, unknown>>> = {
  [K in keyof T]: { type: K } & T[K]
}

export function routeInfo(url: URL): RouteInfo {
  const src = url.pathname.slice(1)
  if (src == "") {
    return { type: "LandingPage" }
  } else if (src === ".well-known/deno-import-intellisense.json") {
    return { type: "IntellisenseManifest" }
  } else if (src.startsWith("completions/")) {
    const segment0 = src.slice(12)
    if (segment0.startsWith("frameCompassTypes")) {
      return { type: "FrameCompassTypeCompletions" }
    } else if (segment0.startsWith("frameCompassUris")) {
      return {
        type: "FrameCompassUriCompletions",
        compassType: segment0.slice("frameCompassUris".length + 1),
      }
    } else if (segment0.startsWith("frameCompassVersions")) {
      const segment1 = segment0.slice("frameCompassVersions".length + 1)
      const slashI = segment1.search("/")
      return {
        type: "FrameCompassVersionCompletions",
        compassType: segment1.slice(0, slashI),
        compassUri: segment1.slice(slashI + 1),
      }
    } else if (segment0.startsWith("frameChainTs")) {
      const segment1 = segment0.slice("frameChainTs".length + 1)
      const [typeAndUri, version] = segment1.split("@")
      const atI = typeAndUri?.search("/")
      if (atI != undefined && atI != -1) {
        return {
          type: "FrameChainTsCompletions",
          compass: {
            type: typeAndUri!.slice(0, atI),
            uri: typeAndUri!.slice(atI + 1),
            version: version!,
          },
        }
      }
    }
  }
  const atI = src.search("@")
  if (atI != -1) {
    const leadingAndCompassVersionAndTrailing = parseLeadingAndCompassVersionAndTrailing(src, atI)
    if (leadingAndCompassVersionAndTrailing) {
      const { leading, version, trailing } = leadingAndCompassVersionAndTrailing
      const codegenTypeAndCompassTypeAndUri = parseCodegenTypeAndCompassTypeAndUri(leading)
      if (codegenTypeAndCompassTypeAndUri) {
        const { codegenType: _0, compassType, compassUri } = codegenTypeAndCompassTypeAndUri
        return {
          type: "FrameChainTs",
          compass: {
            type: compassType,
            uri: compassUri,
            version,
          },
          path: trailing,
        }
      }
    }
  }
  return { type: "Other" }
}

function parseLeadingAndCompassVersionAndTrailing(path: string, atI: number) {
  const leading = path.slice(0, atI)
  const segment1 = path.slice(atI + 1)
  const slashI = segment1.search("/")
  if (slashI == -1) {
    return
  }
  const version = segment1.slice(0, slashI)
  const trailing = segment1.slice(slashI + 1)
  return { leading, version, trailing }
}

function parseCodegenTypeAndCompassTypeAndUri(path: string) {
  const slashI0 = path.search("/")
  if (slashI0 == -1) {
    return
  }
  const codegenType = path.slice(0, slashI0)
  const compassTypeAndUri = path.slice(slashI0 + 1)
  const slashI1 = compassTypeAndUri.search("/")
  if (slashI1 == -1) {
    return
  }
  const compassType = compassTypeAndUri.slice(0, slashI1)
  const compassUri = compassTypeAndUri.slice(slashI1 + 1)
  return { codegenType, compassType, compassUri }
}
