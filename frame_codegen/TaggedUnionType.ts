import { NamedTypeBase } from "/frame_codegen/NamedTypeBase.ts";
import * as m from "/frame_metadata/mod.ts";
import ts from "typescript";

export type TaggedUnionStatements = [
  ts.TypeAliasDeclaration,
  ...[ts.EnumDeclaration, ...ts.InterfaceDeclaration[]] | [],
];

export class TaggedUnionType extends NamedTypeBase<TaggedUnionStatements, m.TaggedUnionTypeDef> {
  constructor(rawType: m.Type<m.TaggedUnionTypeDef>) {
    super(rawType);
  }

  get statements(): TaggedUnionStatements {
    return [] as any;
  }
}
