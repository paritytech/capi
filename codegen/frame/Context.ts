import { f, scaleDecodeNamespaceIdent } from "/codegen/common.ts";
import { CapiImportSpecifier, NamedImport, NamespacedImport } from "/codegen/Import.ts";
import { Config } from "/config/mod.ts";
import * as m from "/frame_metadata/mod.ts";
import * as path from "std/path/mod.ts";
import ts from "typescript";
import capitalizeFirstLetter from "x/case/upperFirstCase.ts";

// TODO: move this elsewhere / swap out with equivalent std path util (if exists)
const ensureRelative = (inQuestion: string): string => {
  if (inQuestion.startsWith(".")) {
    return inQuestion;
  }
  return `./${inQuestion}`;
};

export class FrameTypeDescriptor<Def extends m.TypeDef = m.TypeDef> {
  importedNames: Record<string, true> = {};
  importedDecoderNames: Record<string, true> = {};

  // TODO: ordering
  constructor(
    readonly i: number,
    readonly sourceFileDir: string,
    readonly sourceFilePath: string,
    readonly name: string,
    readonly nameIdent: ts.Identifier,
    readonly raw: m.Type<Def>,
    readonly importDeclarations: ts.ImportDeclaration[],
    readonly decoderName: string,
    readonly decoderNameIdent: ts.Identifier,
  ) {}

  relativeImportSpecifierText(to: FrameTypeDescriptor): string {
    return ensureRelative(path.relative(this.sourceFileDir, to.sourceFilePath).split(path.sep).join("/"));
  }

  importType(importTypeDescriptor: FrameTypeDescriptor) {
    // Safeguard against multiple imports of same name... pesky monomorphization
    if (!this.importedNames[importTypeDescriptor.name]) {
      this.importDeclarations.push(
        NamedImport(importTypeDescriptor.nameIdent, this.relativeImportSpecifierText(importTypeDescriptor)),
      );
      this.importedNames[importTypeDescriptor.name] = true;
    }
  }

  importDecoder(importTypeDescriptor: FrameTypeDescriptor) {
    // Safeguard against multiple imports of same name... pesky monomorphization
    if (!this.importedDecoderNames[importTypeDescriptor.decoderName]) {
      this.importDeclarations.push(
        NamedImport(importTypeDescriptor.decoderNameIdent, this.relativeImportSpecifierText(importTypeDescriptor)),
      );
      this.importedDecoderNames[importTypeDescriptor.decoderName] = true;
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
        const decoderName = `decode${capitalizeFirstLetter(name)}`;
        const decoderNameIdent = f.createIdentifier(decoderName);
        this.typeDescriptorByI[i] = new FrameTypeDescriptor(
          i,
          sourceFileDir,
          sourceFilePath,
          name,
          f.createIdentifier(name),
          raw,
          [scaleImport],
          decoderName,
          decoderNameIdent,
        );
      }
    }
  }
}
