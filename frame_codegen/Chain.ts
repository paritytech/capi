import { AnonymousType } from "/frame_codegen/AnonymousType.ts";
import { isNamedType } from "/frame_codegen/NamedType.ts";
import { RecordType } from "/frame_codegen/RecordType.ts";
import { TaggedUnionType } from "/frame_codegen/TaggedUnionType.ts";
import { Type } from "/frame_codegen/Type.ts";
import * as m from "/frame_metadata/mod.ts";
import * as path from "std/path/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

export class Chain {
  rootType!: Type;

  constructor(
    public alias: string,
    public metadata: m.MetadataContainer,
    public prev?: Chain,
  ) {
    asserts.assert(metadata.raw.types.length > 0); // TODO: other metadata validations?
    this.loadTypes();
  }

  loadTypes() {
    let prev: Type | undefined;
    for (let i = 0; i < this.metadata.raw.types.length; i++) {
      const rawType = this.metadata.raw.types[i]!;
      let current: Type;
      switch (rawType.def._tag) {
        case m.TypeDefKind.Record: {
          current = new RecordType(rawType as m.Type<m.RecordTypeDef>);
          break;
        }
        case m.TypeDefKind.TaggedUnion: {
          current = new TaggedUnionType(rawType as m.Type<m.TaggedUnionTypeDef>);
          break;
        }
        default: {
          current = new AnonymousType(rawType as m.Type<Exclude<m.TypeDef, m.NamedTypeDef>>);
          break;
        }
      }
      if (i === 0) {
        this.rootType = current;
      }
      if (prev) {
        prev.next = current;
      }
      prev = current;
    }
  }

  *sourceFiles(outDirAbs: string): Generator<ts.SourceFile, void, void> {
    const chainOutDirAbs = path.join(outDirAbs, this.alias);

    let current: Type | undefined = this.rootType;
    while (current) {
      if (isNamedType(current)) {
        yield current.sourceFile(chainOutDirAbs);
      }
      current = current.next;
    }

    // TODO: storage effects, misc
  }
}
