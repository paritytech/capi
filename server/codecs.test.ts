import { Codec } from "../deps/scale.ts"
import { assertEquals } from "../deps/std/testing/asserts.ts"
import { DeriveCodec } from "../scale_info/mod.ts"
import * as testClients from "../test_util/clients/mod.ts"
import { InMemoryCache } from "./cache.ts"
import { LocalCapiCodegenServer } from "./local.ts"
import { highlighterPromise } from "./server.ts"

await highlighterPromise

for (const runtime of Object.keys(testClients)) {
  Deno.test(runtime, async () => {
    let port: number
    const server = new LocalCapiCodegenServer()
    server.cache = new InMemoryCache(server.abortController.signal)
    server.listen(0, (x) => port = x.port)
    const chainUrl = `dev:${runtime}`
    const version = await server.latestChainVersion(chainUrl)
    const metadata = await server.metadata(chainUrl, version)
    const codegened = await import(
      `http://localhost:${port!}/@local/proxy/${chainUrl}/@${version}/codecs.ts`
    )
    server.abortController.abort()
    const deriveCodec = DeriveCodec(metadata.tys)
    const derivedCodecs = metadata.tys.map(deriveCodec)
    const codegenCodecs = codegened._all
    const origInspect = Codec.prototype["_inspect"]!
    let inspecting = 0
    Codec.prototype["_inspect"] = function(inspect) {
      if (inspecting) {
        const di = derivedCodecs.indexOf(this)
        if (di !== -1) return "$" + di
        const ci = codegenCodecs.indexOf(this)
        if (ci !== -1) return "$" + ci
      }
      inspecting++
      try {
        return origInspect.call(this, inspect)
      } finally {
        inspecting--
      }
    }
    for (let i = 0; i < derivedCodecs.length; i++) {
      if (
        Deno.inspect(derivedCodecs[i], { depth: Infinity })
          !== Deno.inspect(codegenCodecs[i], { depth: Infinity })
      ) {
        assertEquals(derivedCodecs[i], codegenCodecs[i])
      }
    }
    Codec.prototype["_inspect"] = origInspect
  })
}
