import { Client } from "../../rpc/mod.ts"
import { CtxBase } from "../CtxBase.ts"

export abstract class Provider<PathInfo> {
  declare ctx: CtxBase

  abstract tryParsePathInfo(path: string): TryParsePathInfoResult<PathInfo>
  abstract client(pathInfo: PathInfo): Promise<Client>

  constructor(
    readonly providerMatches: Record<string, boolean>,
    readonly completionInfo: CompletionInfo,
  ) {}

  run(path: string) {
    const slashI0 = path.search("/")
    const junction0 = path.slice(0, slashI0)
    if (junction0 === "completions") {
      const junction1 = path.slice(slashI0 + 1)
      const slashI1 = junction1.search("/")
      const completionType = junction1.slice(slashI1)
      console.log({ completionType })
    }
    return this.tryParsePathInfo(path)
  }
}

export type TryParsePathInfoResult<PathInfo> =
  | (
    & { [K in keyof PathInfo]+?: never }
    & { error: string }
  )
  | PathInfo & { error?: never }

export interface CompletionInfo {}
// export type CompletionInfo = ReturnType<ReturnType<typeof completionInfo>>
export function completionInfo(key: string) {
  return (constants: TemplateStringsArray, ...vars: string[]) => {
    return {
      key,
      constants,
      vars,
    }
  }
}

// {
//   schema:
//     "/:version(@[^/]*)/:_proxy(proxy)/:chainUrl(dev:\\w*|wss?:[^/]*)/:chainVersion(@[^/]+)/:file*",
//   variables: [
//     { key: "version", url: "/autocomplete/version" },
//     { key: "_proxy", url: "/autocomplete/null" },
//     { key: "chainUrl", url: "/${version}/autocomplete/chainUrl/${chainUrl}" },
//     {
//       key: "chainVersion",
//       url: "/${version}/autocomplete/chainVersion/${chainUrl}/${chainVersion}",
//     },
//     {
//       key: "file",
//       url: "/${version}/autocomplete/chainFile/${chainUrl}/${chainVersion}/${file}",
//     },
//   ],
// }
