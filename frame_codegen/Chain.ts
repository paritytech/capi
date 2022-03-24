import { AnonymousType } from "/frame_codegen/AnonymousType.ts";
import { isNamedType } from "/frame_codegen/NamedType.ts";
import { RecordType } from "/frame_codegen/RecordType.ts";
import { TaggedUnionType } from "/frame_codegen/TaggedUnionType.ts";
import { Type } from "/frame_codegen/Type.ts";
import * as m from "/frame_metadata/mod.ts";
import * as path from "std/path/mod.ts";
import * as asserts from "std/testing/asserts.ts";
import ts from "typescript";

const JunctionsJoined = (rawType: m.Type): string => {
  return rawType.path.join("::");
};

export class Chain {
  rootType!: Type;
  typeByI: Record<number, Type> = {};

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
    const overloadsByJunctionsJoined: Record<string, m.Param[][]> = {};
    for (let i = 0; i < this.metadata.raw.types.length; i++) {
      const rawType = this.metadata.raw.types[i]!;
      let current: Type;
      const junctionsJoined = JunctionsJoined(rawType);
      let overloads: m.Param[][] | undefined = overloadsByJunctionsJoined[junctionsJoined];
      if (rawType.params.length > 0) {
        if (overloads) {
          overloads.push(rawType.params);
        } else {
          overloadsByJunctionsJoined[junctionsJoined] = [rawType.params];
          overloads = overloadsByJunctionsJoined[junctionsJoined];
        }
      }
      switch (rawType.def._tag) {
        case m.TypeDefKind.Record: {
          current = new RecordType(rawType as m.Type<m.RecordTypeDef>, overloads);
          break;
        }
        case m.TypeDefKind.TaggedUnion: {
          current = new TaggedUnionType(rawType as m.Type<m.TaggedUnionTypeDef>, overloads);
          break;
        }
        default: {
          current = new AnonymousType(rawType as m.Type<Exclude<m.TypeDef, m.NamedTypeDef>>, overloads);
          break;
        }
      }
      this.typeByI[i] = current;
      if (prev) {
        prev.next = current;
      }
      prev = current;
    }
    this.rootType = this.typeByI[0]!;
  }

  *typeSourceFiles(chainOutDirAbs: string): Generator<ts.SourceFile, void, void> {
    const alreadyYielded: Record<string, true> = {};
    let current: Type | undefined = this.rootType;
    while (current) {
      const junctionsJoined = JunctionsJoined(current.rawType);
      if (!alreadyYielded[junctionsJoined]) {
        if (isNamedType(current)) {
          yield current.sourceFile(chainOutDirAbs);
        }
        alreadyYielded[junctionsJoined] = true;
      }
      current = current.next;
    }
  }

  *sourceFiles(outDirAbs: string): Generator<ts.SourceFile, void, void> {
    const chainOutDirAbs = path.join(outDirAbs, this.alias);
    yield* this.typeSourceFiles(chainOutDirAbs);
    // TODO: storage effects, misc
  }
}
