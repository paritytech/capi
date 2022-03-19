import { f } from "/codegen/common.ts";
import { ExportStar } from "/codegen/Export.ts";
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
import ts from "typescript";

const getMetadata = async (wsUrl: string): Promise<m.MetadataContainer> => {
  const chain = frame.Chain.ProxyWebSocketUrl(sys.lift(wsUrl));
  const result = await sys.Fiber(chain, {
    connections: new sys.WebSocketConnections(),
  });
  asserts.assert(!(result instanceof Error));
  return result.value.metadata;
};

// TODO: have to be able to communicate the binding from within `Import` call
export async function* FrameChainSourceFileIter(
  config: Config,
  alias: string,
  resource: string, // Todo: make this compatible with string lists & chain specs
): AsyncGenerator<ts.SourceFile, void, void> {
  const metadata = await getMetadata(resource);
  const outDir = path.join(config.outDirAbs, "frame", alias);
  const decodeNamespaceIdent = f.createUniqueName("d");
  const typeNameAndPathEntryByIndex: Record<number, [string, string[]]> = {};

  for (let typeI = 0; typeI < metadata.raw.types.length; typeI++) {
    const type = metadata.raw.types[typeI]!;
    if (type.path && type.path.length > 0) {
      // Is a composite or variant.
      const finalI = type.path.length - 1;
      const finalPathPiece = type.path[finalI]!;
      const sourceFileDir = path.join(outDir, ...type.path.slice(0, finalI));
      const sourceFilePath = path.join(sourceFileDir, `${finalPathPiece}.ts`);
      typeNameAndPathEntryByIndex[typeI] = [finalPathPiece, type.path];
      yield SourceFile(sourceFilePath, [
        Type(finalPathPiece, type, metadata),
      ])(config);
    } else { /* Is inlineable (primitive, compact, tuple or array) */ }
  }

  for (let palletI = 0; palletI < metadata.raw.pallets.length; palletI++) {
    const pallet = metadata.raw.pallets[palletI]!;

    if (pallet.storage) {
      const sourceFileDir = path.join(outDir, pallet.name, "storage");
      const modFilePath = path.join(sourceFileDir, "mod.ts");
      const storageFileNames: string[] = [];

      for (let storageEntryI = 0; storageEntryI < pallet.storage.entries.length; storageEntryI++) {
        const storageEntry = pallet.storage.entries[storageEntryI]!;
        const fileName = `${storageEntry.name}.ts`;
        storageFileNames.push(fileName);
        const sourceFilePath = path.join(sourceFileDir, fileName);
        if (pallet.name === "System" && storageEntry.name === "Account") {
          const nameAndPathEntry = typeNameAndPathEntryByIndex[storageEntry.type.value];
          asserts.assert(nameAndPathEntry);
          console.log(nameAndPathEntry);
          yield SourceFile(sourceFilePath, [
            Import(sourceFileDir, decodeNamespaceIdent, "scale", "decode"),
            // ImportNamed(sourceFileDir, ""),
            // TODO: re-arrange params & perhaps abstract into a `Ctx` of some sort.
            TypeDecoder(decodeNamespaceIdent, metadata, storageEntry),
          ])(config);
        }
      }

      yield SourceFile(modFilePath, storageFileNames.map((storageFileName) => ExportStar(`./${storageFileName}`)))(
        config,
      );
    }
  }
}
