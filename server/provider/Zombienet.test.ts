import { assertEquals } from "../../deps/std/testing/asserts.ts"
import { parseZombienetSubpathInfo } from "./Zombienet.ts"

Deno.test("Zombienet Path Info Parsing", () => {
  assertEquals(
    parseZombienetSubpathInfo("examples/xcm_teleport_assets.toml/alice@version/mod.ts"),
    {
      chainKey: "examples/xcm_teleport_assets.toml/alice@version",
      configPath: "examples/xcm_teleport_assets.toml",
      chainId: "alice",
      version: "version",
      filePath: "mod.ts",
      ext: ".ts",
    },
  )
})
