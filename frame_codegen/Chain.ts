import { AnonymousType } from "/frame_codegen/AnonymousType.ts";
import { isNamedType, NamedType } from "/frame_codegen/NamedType.ts";
import { RecordType } from "/frame_codegen/RecordType.ts";
import { TaggedUnionType } from "/frame_codegen/TaggedUnionType.ts";
import { Type } from "/frame_codegen/Type.ts";
import * as m from "/frame_metadata/mod.ts";
import * as path from "std/path/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

export class Chain {
  typeByI: Record<number, Type> = {};
  typeByPath: Record<string, Type> = {};

  constructor(
    public alias: string,
    public metadata: m.MetadataContainer,
    public prev?: Chain, // TODO: incremental & watch
  ) {
    asserts.assert(metadata.raw.types.length > 0); // TODO: other metadata validations?
    this.loadTypes();
  }

  getType = (i: number): Type => {
    const type = this.typeByI[i];
    asserts.assert(type);
    return type;
  };

  loadTypes() {
    this.metadata.raw.types.forEach((rawType) => {
      const typePath = rawType.path.join("::");
      let type: Type;
      switch (rawType.def._tag) {
        case m.TypeDefKind.Record:
        case m.TypeDefKind.TaggedUnion: {
          const alreadyExists = this.typeByPath[typePath];
          if (alreadyExists) {
            type = alreadyExists;
            if (rawType.params.length > 0) {
              (type as NamedType).overload(rawType.params);
            }
          } else {
            switch (rawType.def._tag) {
              case m.TypeDefKind.Record: {
                type = new RecordType(this, rawType as m.Type<m.RecordTypeDef>);
                break;
              }
              case m.TypeDefKind.TaggedUnion: {
                type = new TaggedUnionType(this, rawType as m.Type<m.TaggedUnionTypeDef>);
                break;
              }
            }
          }
          break;
        }
        default: {
          type = new AnonymousType(this, rawType as m.Type<Exclude<m.TypeDef, m.NamedTypeDef>>);
          break;
        }
      }
      this.typeByPath[typePath] = type;
      this.typeByI[rawType.i] = type;
    });
  }

  *typeSourceFiles(chainOutDirAbs: string): Generator<ts.SourceFile, void, void> {
    for (const type of Object.values(this.typeByPath)) {
      if (isNamedType(type)) {
        yield type.sourceFile(chainOutDirAbs);
      }
    }
  }

  *sourceFiles(outDirAbs: string): Generator<ts.SourceFile, void, void> {
    const chainOutDirAbs = path.join(outDirAbs, this.alias);
    yield* this.typeSourceFiles(chainOutDirAbs);
    // TODO: storage effects, misc
  }
}
