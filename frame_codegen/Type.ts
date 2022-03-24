import { AnonymousType } from "/frame_codegen/AnonymousType.ts";
import { RecordType } from "/frame_codegen/RecordType.ts";
import { TaggedUnionType } from "/frame_codegen/TaggedUnionType.ts";

export type Type = AnonymousType | RecordType | TaggedUnionType;
