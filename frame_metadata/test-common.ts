import * as path from "../_deps/std/path.ts";
import * as M from "../frame_metadata/mod.ts";

const downloadedDir = new URL("../frame_metadata/_downloaded", import.meta.url).pathname;

type NetworkName =
  | "acala"
  | "kusama"
  | "moonbeam"
  | "polkadot"
  | "statemint"
  | "subsocial"
  | "westend";

export async function Metadata(networkName: NetworkName): Promise<M.Metadata> {
  const metadataEncoded = await Deno.readTextFile(path.join(downloadedDir, `${networkName}.scale`));
  return M.fromPrefixedHex(metadataEncoded);
}
