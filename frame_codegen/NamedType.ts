import { NamedTypeBase } from "/frame_codegen/NamedTypeBase.ts";
import { RecordType } from "/frame_codegen/RecordType.ts";
import { TaggedUnionType } from "/frame_codegen/TaggedUnionType.ts";
import { Type } from "/frame_codegen/Type.ts";

export type NamedType = RecordType | TaggedUnionType;

export const isNamedType = (inQuestion: Type): inQuestion is NamedType => {
  return inQuestion instanceof NamedTypeBase;
};
