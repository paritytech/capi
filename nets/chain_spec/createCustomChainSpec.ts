import { ensureDir } from "../../deps/std/fs.ts"
import * as path from "../../deps/std/path.ts"
import { ChainSpec } from "./ChainSpec.ts"
import { createRawChainSpec } from "./createRawChainSpec.ts"

export async function createCustomChainSpec(
  tempDir: string,
  binary: string,
  chain: string,
  customize: (chainSpec: ChainSpec) => void,
) {
  await ensureDir(tempDir)
  const specResult = await new Deno.Command(binary, {
    args: ["build-spec", "--disable-default-bootnode", "--chain", chain],
  }).output()
  if (!specResult.success) {
    // TODO: improve error message
    throw new Error("build-spec failed")
  }
  const spec = JSON.parse(new TextDecoder().decode(specResult.stdout))
  customize(spec)
  const specPath = path.join(tempDir, `chainspec.json`)
  await Deno.writeTextFile(specPath, JSON.stringify(spec, undefined, 2))
  return createRawChainSpec(tempDir, binary, specPath)
}
