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

const cache: Partial<Record<NetworkName, [M.Metadata, M.DeriveCodec]>> = {};
export async function setup(networkName: NetworkName): Promise<[M.Metadata, M.DeriveCodec]> {
  let res = cache[networkName];
  if (res) {
    return res;
  }
  const metadataEncoded = await Deno.readTextFile(path.join(downloadedDir, `${networkName}.scale`));
  const metadata = M.fromPrefixedHex(metadataEncoded);
  res = [metadata, M.DeriveCodec(metadata.tys)];
  cache[networkName] = res;
  return res;
}
