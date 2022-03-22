import { f, scaleDecodeNamespaceIdent } from "/codegen/common.ts";
import { CapiImportSpecifier, NamespacedImport } from "/codegen/Import.ts";
import { Config } from "/config/mod.ts";
import * as m from "/frame_metadata/mod.ts";
import * as path from "std/path/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

export interface FrameTypeDescriptor {
  i: number;
  sourceFileDir: string;
  sourceFilePath: string;
  name: string;
  nameIdent: ts.Identifier;
  raw: m.Type;
  importDeclarations: ts.ImportDeclaration[];
  importedNames: Record<string, true>;
}

export class FrameContext {
  outDir;
  typesOutDir;
  typeDescriptorByI: Record<number, FrameTypeDescriptor> = {};
  typeDescriptorByIEntries;

  constructor(
    readonly config: Config,
    readonly chainAlias: string,
    readonly beacon: string,
    readonly metadata: m.MetadataContainer,
  ) {
    this.outDir = path.join(config.outDirAbs, "frame", chainAlias);
    this.typesOutDir = path.join(this.outDir, "_types");

    for (let i = 0; i < metadata.raw.types.length; i++) {
      const raw = metadata.raw.types[i]!;
      if (raw.path.length > 0) {
        const nameI = raw.path.length - 1;
        const name = raw.path[nameI]!;
        const sourceFileDir = path.join(this.typesOutDir, ...raw.path.slice(0, nameI));
        const sourceFilePath = path.join(sourceFileDir, `${name}.ts`);
        const scaleImport = NamespacedImport(
          scaleDecodeNamespaceIdent,
          CapiImportSpecifier(config, sourceFileDir, ["scale", "decode"]),
        );
        this.typeDescriptorByI[i] = {
          i,
          sourceFileDir,
          sourceFilePath,
          name,
          nameIdent: f.createIdentifier(name),
          raw,
          importDeclarations: [scaleImport],
          importedNames: {},
        };
      }
    }

    this.typeDescriptorByIEntries = Object.entries(this.typeDescriptorByI);
  }

  relativeImportSpecifier(fromI: number, toI: number) {
    const { [fromI]: from, [toI]: to } = this.typeDescriptorByI;
    asserts.assert(from && to);
    return path.relative(from.sourceFileDir, to.sourceFilePath).split(path.sep).join("/");
  }
}
