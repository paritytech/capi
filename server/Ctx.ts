import { CacheBase } from "../util/cache/mod.ts"
import { Provider } from "./provider/mod.ts"

export class Ctx {
  constructor(
    readonly cache: CacheBase,
    readonly providers: Provider<unknown>[],
    readonly signal: AbortSignal,
  ) {
    providers.forEach((provider) => (provider.ctx = this))
  }

  intellisense() {
    return JSON.stringify({
      $schema: "https://deno.land/x/deno@v1.29.1/cli/schemas/registry-completions.v2.json",
      version: 2,
      registries: [
        {
          schema: "/:version(@[^/]*)?/:file*",
          variables: [
            { key: "version", url: "/autocomplete/version" },
            { key: "file", url: "/${version}/autocomplete/moduleFile/${file}" },
          ],
        },
        {
          schema:
            "/:version(@[^/]*)/:_proxy(proxy)/:chainUrl(dev:\\w*|wss?:[^/]*)/:chainVersion(@[^/]+)/:file*",
          variables: [
            { key: "version", url: "/autocomplete/version" },
            { key: "_proxy", url: "/autocomplete/null" },
            { key: "chainUrl", url: "/${version}/autocomplete/chainUrl/${chainUrl}" },
            {
              key: "chainVersion",
              url: "/${version}/autocomplete/chainVersion/${chainUrl}/${chainVersion}",
            },
            {
              key: "file",
              url: "/${version}/autocomplete/chainFile/${chainUrl}/${chainVersion}/${file}",
            },
          ],
        },
      ],
    })
  }
}
