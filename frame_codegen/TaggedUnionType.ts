import { NamedTypeBase } from "/frame_codegen/NamedTypeBase.ts";
import * as m from "/frame_metadata/mod.ts";
import ts from "typescript";

export type TaggedUnionStatements = [
  ts.TypeAliasDeclaration,
  ...[ts.EnumDeclaration, ...ts.InterfaceDeclaration[]] | [],
];

export class TaggedUnionType extends NamedTypeBase<TaggedUnionStatements, m.TaggedUnionTypeDef> {
  constructor(
    rawType: m.Type<m.TaggedUnionTypeDef>,
    overloads?: m.Param[][],
  ) {
    super(rawType, overloads);
  }

  get statements(): TaggedUnionStatements {
    if (this.name === "Option") {
      console.log(this);
      console.log("\n\n");
    }
    return [] as any;
  }
}
