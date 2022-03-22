import { f, scaleDecodeNamespaceIdent } from "/codegen/common.ts";
import { FrameContext } from "/codegen/frame/Context.ts";
import { Type } from "/codegen/frame/Type.ts";
import { TypeDecoder } from "/codegen/frame/TypeDecoder.ts";
import { CapiImportSpecifier, NamespacedImport } from "/codegen/Import.ts";
import { SourceFile } from "/codegen/SourceFile.ts";
import { Config } from "/config/mod.ts";
import { WebSocketConnectionPool } from "/connection/mod.ts";
import * as frame from "/frame/mod.ts";
import * as m from "/frame_metadata/mod.ts";
import * as s from "/system/mod.ts";
import * as path from "std/path/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

// TODO: make this compatible with string lists & chain specs
export async function* FrameChainSourceFileIter(
  config: Config,
  chainAlias: string,
  beacon: string,
): AsyncGenerator<ts.SourceFile, void, void> {
  const fiber = new s.Fiber(frame.Metadata(s.Resource.ProxyWebSocketUrl(s.lift(beacon))));
  const result = await fiber.run({ connections: new WebSocketConnectionPool() });
  asserts.assert(!(result instanceof Error));
  const metadata = result.value;
  const context = new FrameContext(config, chainAlias, beacon, metadata);

  for (let entryI = 0; entryI < context.typeDescriptorByIEntries.length; entryI++) {
    const typeMetadataByIdEntry = context.typeDescriptorByIEntries[entryI]!;
    const [typeI, { name, sourceFileDir, sourceFilePath, raw }] = typeMetadataByIdEntry;

    const importDeclarations: ts.ImportDeclaration[] = [
      NamespacedImport(scaleDecodeNamespaceIdent, CapiImportSpecifier(config, sourceFileDir, ["scale", "decode"])),
    ];

    yield SourceFile(sourceFilePath, [
      ...importDeclarations,
      // Type(name, type, metadata),
      // TypeDecoder(decodeNamespaceIdent, parseInt(typeI), name, metadata),
    ]);
  }
}

// Is inlineable (primitive, compact, tuple or array)
// switch (type.def._tag) {
//   case m.TypeDefKind.Sequence: {
//     const typeParamI = type.def.typeParam;
//     const typeParam = metadata.raw.types[typeParamI];
//     const typeParamPath = typeParam?.path;
//     if (typeParamPath && typeParamPath.length > 0) {
//       // importDeclarations.
//     }
//     break;
//   }
//   case m.TypeDefKind.Tuple: {
//     const typeReferenceNodes = type.def.fields.map((field) => {
//       const elementType = metadata.raw.types[field];
//       asserts.assert(elementType);
//       visited[elementType.def._tag] = true;
//       return f.createTypeReferenceNode(f.createIdentifier("A"), undefined);
//     });
//     typeNodeByI[typeI] = f.createTupleTypeNode(typeReferenceNodes);
//     break;
//   }
//   case m.TypeDefKind.FixedLenArray: {
//     break;
//   }
// }
