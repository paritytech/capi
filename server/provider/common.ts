import { Client } from "../../rpc/mod.ts"
import { CtxBase } from "../CtxBase.ts"

export abstract class Provider<PathInfo> {
  declare ctx: CtxBase

  abstract tryParsePathInfo(path: string): TryParsePathInfoResult<PathInfo>
  abstract client(pathInfo: PathInfo): Promise<Client>
  abstract codegen(path: string): Promise<string>

  async run(path: string) {
    return new Response()
  }

  constructor(
    readonly match: Record<string, boolean>,
    readonly completionInfo: CompletionInfo,
  ) {}
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
