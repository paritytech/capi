import { NamedType } from "/frame_codegen/type/Named.ts";
import * as m from "/frame_metadata/mod.ts";
import ts from "typescript";

export type TaggedUnionStatements = [
  ts.TypeAliasDeclaration,
  ...[ts.EnumDeclaration, ...ts.InterfaceDeclaration[]] | [],
];

export class TaggedUnionType extends NamedType<
  m.TaggedUnionTypeDef,
  TaggedUnionStatements
> {
  get statements() {
    return [] as any;
  }
}
