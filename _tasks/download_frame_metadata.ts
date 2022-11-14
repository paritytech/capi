import * as fs from "../deps/std/fs.ts"
import * as path from "../deps/std/path.ts"
import * as Z from "../deps/zones.ts"
import * as C from "../mod.ts"
import * as U from "../util/mod.ts"

const outDir = path.join(Deno.cwd(), "frame_metadata", "_downloaded")
await fs.emptyDir(outDir)
U.throwIfError(
  await Z.ls(
    ...Object.entries(C.knownClients)
      .map(([k, { proxy }]) => [k, proxy] as [Z.$<string>, Z.$<C.rpc.Client>])
      .map(download),
  ).run(),
)

function download<Name extends Z.$<string>, Client extends Z.$<C.rpc.Client>>(
  entry: [name: Name, client: Client],
) {
  return Z.ls(...entry).next(async ([name, client]) => {
    try {
      const metadataHex = U.throwIfError(await C.state.getMetadata(client)().run())
      const outPath = path.join(outDir, `${name}.scale`)
      console.log(`Downloading ${name} metadata to "${outPath}".`)
      await Deno.writeTextFile(outPath, metadataHex)
      return
    } catch (cause) {
      return new MetadataDownloadError(name, { cause })
    }
  })
}

class MetadataDownloadError extends Error {
  override readonly name = "MetadataDownloadError"

  constructor(readonly chainName: string, options: ErrorOptions) {
    super(undefined, options)
  }
}
