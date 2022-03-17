import { f } from "/codegen/common.ts";
import { Type } from "/codegen/frame/Type.ts";
import { TypeDecoder } from "/codegen/frame/TypeDecoder.ts";
import { Import } from "/codegen/Import.ts";
import { SourceFile } from "/codegen/SourceFile.ts";
import { Config } from "/config/mod.ts";
import * as frame from "/frame/mod.ts";
import * as m from "/frame_metadata/mod.ts";
import * as sys from "/system/mod.ts";
import * as path from "std/path/mod.ts";
import * as asserts from "std/testing/asserts.ts";

const getMetadata = async (wsUrl: string): Promise<m.MetadataContainer> => {
  const chain = frame.Chain.ProxyWebSocketUrl(sys.lift(wsUrl));
  const result = await sys.Fiber(chain, new sys.WebSocketConnections(), {});
  asserts.assert(!(result instanceof Error));
  return result.value.metadata;
};

// TODO: have to be able to communicate the binding from within `Import` call
export async function* FrameChainSourceFileIter(
  config: Config,
  alias: string,
  resource: string, // Todo: make this compatible with string lists & chain specs
) {
  const metadata = await getMetadata(resource);
  const outDir = path.join(config.outDirAbs, "frame", alias);
  const decodeNamespaceIdent = f.createUniqueName("d");

  for (let typeI = 0; typeI < metadata.raw.types.length; typeI++) {
    const type = metadata.raw.types[typeI]!;
    if (type.path && type.path.length > 0) {
      // Is a composite or variant.
      const finalI = type.path.length - 1;
      const finalPathPiece = type.path[finalI]!;
      const sourceFileDir = path.join(outDir, ...type.path.slice(0, finalI));
      const sourceFilePath = path.join(sourceFileDir, `${finalPathPiece}.ts`);
      console.log(sourceFilePath);
      // console.log(type.def);
      yield SourceFile(sourceFilePath, [
        Type(finalPathPiece, type, metadata),
      ])(config);
    } else { /* Is inlineable (primitive, compact, tuple or array) */ }
  }

  if (false as boolean) { // TODO: get rid of this line
    for (let palletI = 0; palletI < metadata.raw.pallets.length; palletI++) {
      const pallet = metadata.raw.pallets[palletI]!;

      if (pallet.storage) {
        for (let storageEntryI = 0; storageEntryI < pallet.storage.entries.length; storageEntryI++) {
          const storageEntry = pallet.storage.entries[storageEntryI]!;
          const sourceFileDir = path.join(outDir, pallet.name, "storage");
          const sourceFilePath = path.join(sourceFileDir, `${storageEntry.name}.ts`);
          yield SourceFile(sourceFilePath, [
            Import(sourceFileDir, decodeNamespaceIdent, "scale", "decode"),
            pallet.name === "System" && storageEntry.name === "Account"
              ? TypeDecoder(decodeNamespaceIdent, metadata, storageEntry)
              : Import(sourceFileDir, f.createIdentifier("SOMETHING")),
          ])(config);
        }
      }
    }
  }
}
