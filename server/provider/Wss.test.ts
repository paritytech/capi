import { assertEquals } from "../../deps/std/testing/asserts.ts"
import { WssProvider } from "./Wss.ts"

Deno.test("Ws Path Info Parsing", () => {
  assertEquals(WssProvider.prototype.tryParsePathInfo("rpc.polkadot.io@version/mod.ts"), {
    ws: "rpc.polkadot.io",
    runtimeVersion: "version",
    tsFilePath: "mod.ts",
  })
})
