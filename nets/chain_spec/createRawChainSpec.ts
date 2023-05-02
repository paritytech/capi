import { ensureDir } from "../../deps/std/fs.ts"
import * as path from "../../deps/std/path.ts"

export async function createRawChainSpec(tempDir: string, binary: string, chain: string) {
  await ensureDir(tempDir)
  const rawResult = await new Deno.Command(binary, {
    args: ["build-spec", "--disable-default-bootnode", "--chain", chain, "--raw"],
  }).output()
  // TODO: improve error message
  if (!rawResult.success) throw new Error("build-spec --raw failed")
  const rawPath = path.join(tempDir, `chainspec-raw.json`)
  await Deno.writeFile(rawPath, rawResult.stdout)
  return rawPath
}
