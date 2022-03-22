import { f, scaleDecodeNamespaceIdent } from "/codegen/common.ts";
import { CapiImportSpecifier, NamedImport, NamespacedImport } from "/codegen/Import.ts";
import { Config } from "/config/mod.ts";
import * as m from "/frame_metadata/mod.ts";
import * as path from "std/path/mod.ts";
import ts from "typescript";

export class FrameTypeDescriptor<Def extends m.TypeDef = m.TypeDef> {
  // TODO: ordering
  constructor(
    readonly i: number,
    readonly sourceFileDir: string,
    readonly sourceFilePath: string,
    readonly name: string,
    readonly nameIdent: ts.Identifier,
    readonly raw: m.Type<Def>,
    readonly importDeclarations: ts.ImportDeclaration[],
    readonly importedNames: Record<string, true>,
  ) {}

  addNamedImport(importTypeDescriptor: FrameTypeDescriptor) {
    // Safeguard against multiple imports of same name... pesky monomorphization
    if (!this.importedNames[importTypeDescriptor.name]) {
      const importSpecifier = path.relative(this.sourceFileDir, importTypeDescriptor.sourceFilePath)
        .split(path.sep).join("/");
      this.importDeclarations.push(NamedImport(importTypeDescriptor.nameIdent, importSpecifier));
      this.importedNames[importTypeDescriptor.name] = true;
    }
  }
}

export class FrameContext {
  outDir;
  typesOutDir;
  typeDescriptorByI: Record<number, FrameTypeDescriptor<m.RecordTypeDef | m.TaggedUnionTypeDef>> = {};

  constructor(
    readonly config: Config,
    readonly chainAlias: string,
    readonly beacon: string,
    readonly metadata: m.MetadataContainer,
  ) {
    this.outDir = path.join(config.outDirAbs, "frame", chainAlias);
    this.typesOutDir = path.join(this.outDir, "_types");

    for (let i = 0; i < metadata.raw.types.length; i++) {
      const raw = metadata.raw.types[i]! as m.Type<m.RecordTypeDef | m.TaggedUnionTypeDef>;

      if (raw.path.length > 0) {
        const nameI = raw.path.length - 1;
        const name = raw.path[nameI]!;
        const sourceFileDir = path.join(this.typesOutDir, ...raw.path.slice(0, nameI));
        const sourceFilePath = path.join(sourceFileDir, `${name}.ts`);
        const scaleImport = NamespacedImport(
          scaleDecodeNamespaceIdent,
          CapiImportSpecifier(config, sourceFileDir, ["scale", "decode"]),
        );
        this.typeDescriptorByI[i] = new FrameTypeDescriptor(
          i,
          sourceFileDir,
          sourceFilePath,
          name,
          f.createIdentifier(name),
          raw,
          [scaleImport],
          {},
        );
      }
    }
  }
}
