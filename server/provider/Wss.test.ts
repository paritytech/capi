import { assertEquals } from "../../deps/std/testing/asserts.ts"
import { parseWssPathInfo } from "./Wss.ts"

Deno.test("Wss Path Info Parsing", () => {
  assertEquals(parseWssPathInfo("rpc.polkadot.io@version/mod.ts"), {
    chainKey: "rpc.polkadot.io@version",
    protocolTrailing: "rpc.polkadot.io",
    version: "version",
    filePath: "mod.ts",
    ext: ".ts",
  })
})
