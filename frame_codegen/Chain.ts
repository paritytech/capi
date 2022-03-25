import { FrameCodegen } from "/frame_codegen/mod.ts";
import { Type } from "/frame_codegen/type/Base.ts";
import { NamedType } from "/frame_codegen/type/Named.ts";
import { RecordType } from "/frame_codegen/type/Record.ts";
import { TaggedUnionType } from "/frame_codegen/type/TaggedUnion.ts";
import * as m from "/frame_metadata/mod.ts";
import * as path from "std/path/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

export class Chain {
  typeByI: Record<number, Type> = {};
  typeByPath: Record<string, Type> = {};
  typesOurDirAbs;

  constructor(
    public codegen: FrameCodegen,
    public alias: string,
    public metadata: m.MetadataContainer,
    public prev: Chain | undefined, // TODO: incremental & watch
  ) {
    this.typesOurDirAbs = path.join(this.codegen.config.outDirAbs, "_types");
    this.loadTypes();
  }

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
                // TODO: get it to narrow type based on current branch
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
          type = new Type(this, rawType as m.Type<Exclude<m.TypeDef, m.NamedTypeDef>>);
          break;
        }
      }
      this.typeByPath[typePath] = type;
      this.typeByI[rawType.i] = type;
    });
  }

  getType(i: number): Type {
    const type = this.typeByI[i];
    asserts.assert(type);
    return type;
  }

  *typeSourceFiles(): Generator<ts.SourceFile, void, void> {
    for (const type of Object.values(this.typeByPath)) {
      if (type instanceof NamedType) {
        yield type.SourceFile();
      }
    }
  }

  *sourceFiles(): Generator<ts.SourceFile, void, void> {
    yield* this.typeSourceFiles();
    // TODO: storage effects, misc
  }
}
