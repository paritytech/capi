import { MetadataContainer } from "/frame_metadata/Container.ts";
import * as m from "/frame_metadata/V14.ts";
import { TypeDefVisitor } from "/frame_metadata/Visitor.ts";
import { Tagged } from "/scale/decode-patterns.ts";
import * as d from "/scale/decode.ts";
import * as asserts from "std/testing/asserts.ts";

const primitiveDecoders: {
  [_ in m.PrimitiveTypeDefKind]: d.AnyDecoder;
} = {
  [m.PrimitiveTypeDefKind.Bool]: d.bool,
  [m.PrimitiveTypeDefKind.Char]: d.str,
  [m.PrimitiveTypeDefKind.Str]: d.str,
  [m.PrimitiveTypeDefKind.U8]: d.u8,
  [m.PrimitiveTypeDefKind.U16]: d.u16,
  [m.PrimitiveTypeDefKind.U32]: d.u32,
  [m.PrimitiveTypeDefKind.U64]: d.u64,
  [m.PrimitiveTypeDefKind.U128]: d.u128,
  [m.PrimitiveTypeDefKind.U256]: d.u256,
  [m.PrimitiveTypeDefKind.I8]: d.i8,
  [m.PrimitiveTypeDefKind.I16]: d.i16,
  [m.PrimitiveTypeDefKind.I32]: d.i32,
  [m.PrimitiveTypeDefKind.I64]: d.i64,
  [m.PrimitiveTypeDefKind.I128]: d.i128,
  [m.PrimitiveTypeDefKind.I256]: d.i256,
};

type FrameTypeVisitor = TypeDefVisitor<{ [_ in m.TypeDefKind]: d.AnyDecoder }>;

export class FrameTypeDecoder implements FrameTypeVisitor {
  constructor(
    readonly metadata: MetadataContainer,
    readonly typeI: number,
  ) {}

  digest(): d.UnknownDecoder {
    return this.visit(this.typeI);
  }

  visit(i: number): d.AnyDecoder {
    const ty = this.metadata.raw.types[i];
    asserts.assert(ty);
    return (this[ty.def._tag] as any)(ty.def);
  }

  decodeFields(fields: m.Field[]): d.AnyRecordField[] {
    return fields.map((field, i) => {
      return d.RecordField(field.name === undefined ? i : field.name, this.visit(field.type));
    });
  }

  Record(typeDef: m.RecordTypeDef) {
    return d.Record(...this.decodeFields(typeDef.fields));
  }

  TaggedUnion(typeDef: m.TaggedUnionTypeDef) {
    return d.Union(
      ...typeDef.members.map((member) => {
        return Tagged(member.name, ...this.decodeFields(member.fields || []));
      }),
    );
  }

  Sequence(typeDef: m.SequenceTypeDef) {
    return d.Tuple(this.visit(typeDef.typeParam));
  }

  FixedLenArray(typeDef: m.FixedLenArrayTypeDef) {
    return d.FixedSizeArray(this.visit(typeDef.typeParam), typeDef.len);
  }

  Tuple(typeDef: m.TupleTypeDef) {
    return d.Tuple(...typeDef.fields.map(this.visit));
  }

  Primitive(typeDef: m.PrimitiveTypeDef) {
    return primitiveDecoders[typeDef.kind];
  }

  Compact() {
    return d.compact;
  }

  BitSequence(typeDef: m.BitSequenceTypeDef) {
    return asserts.unimplemented();
  }
}
