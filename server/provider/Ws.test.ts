import { assertEquals } from "../../deps/std/testing/asserts.ts"
import { WsProvider } from "./Ws.ts"

Deno.test("Ws Path Info Parsing", () => {
  assertEquals(WsProvider.prototype.tryParsePathInfo("rpc.polkadot.io@version/mod.ts"), {
    ws: "rpc.polkadot.io",
    runtimeVersion: "version",
    tsFilePath: "mod.ts",
  })
})
